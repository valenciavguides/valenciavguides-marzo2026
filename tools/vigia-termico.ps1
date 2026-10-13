# vigia-termico.ps1 - vigila la temperatura del equipo mientras corre una tanda de Playwright y la corta antes de que el
# sistema hiberne. Solo lee contadores del sistema: no toca el proyecto.
#
# Lo lanza tools/tanda-vigilada.js. A mano:
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/vigia-termico.ps1 -Salida vigia.csv -PidTanda <pid>
#
#   -Salida <csv>     fichero donde apunta una linea por muestra (una por segundo, aproximadamente)
#   -Segundos <n>     cuanto vigila como mucho (4 horas por defecto); tambien acaba cuando el proceso de -PidTanda termina
#   -CorteC <grados>  temperatura de la zona a la que corta la tanda (85 por defecto)
#   -PidTanda <pid>   proceso que lanza la tanda (tools/tanda-vigilada.js); al cortar se para todo lo que cuelga de el
#                     menos este vigia -Playwright, sus workers y sus navegadores- y los navegadores de Playwright que
#                     queden abiertos; el proceso en si no se toca, para que pueda decir que la tanda se ha cortado
#   -Zona <texto>     trozo del nombre de la zona termica ACPI que se vigila (HPTZ por defecto, la que hiberna este equipo)
#
# Columnas del CSV: hora; grados de la zona; carga total de CPU en %; procesos de navegador y de node vivos, por nombre,
# con cuantos hay y cuantos nucleos gastan entre todos; nota (CORTE cuando corta).
#
# Este fichero va en ASCII a proposito: PowerShell 5.1 lee un .ps1 sin BOM como ANSI y rompe cualquier acento. Por lo
# mismo no lleva escrita la ruta del contador termico, que en un Windows en espanol tiene acentos: la descubre.
param([string]$Salida, [int]$Segundos = 14400, [double]$CorteC = 85, [int]$PidTanda = 0, [string]$Zona = 'HPTZ')

# Solo se mira el juego de contadores de la zona termica: recorrer todos los del sistema tarda segundos a plena CPU.
# El comodin ? ocupa el sitio de las letras con acento del nombre en espanol.
$rutas = (Get-Counter -ListSet 'Informaci?n sobre la zona t?rmica', 'Thermal Zone Information' -ErrorAction SilentlyContinue).PathsWithInstances
$termica = $rutas | Where-Object { $_ -like "*$Zona*" } | Select-Object -First 1
if (-not $termica) { $termica = $rutas | Select-Object -First 1 }
# La carga de CPU: el contador se llama distinto segun el idioma de Windows (los dos nombres son ASCII).
$cpu = $null
foreach ($candidato in '\Procesador(_Total)\% de tiempo de procesador', '\Processor(_Total)\% Processor Time') {
  try { Get-Counter -Counter $candidato -ErrorAction Stop | Out-Null; $cpu = $candidato; break } catch {}
}

"hora;zona_C;cpu_pct;procesos;nota" | Out-File -FilePath $Salida -Encoding ascii
if (-not $termica) { "# sin zona termica legible: el vigia no puede cortar" | Out-File -FilePath $Salida -Append -Encoding ascii }

function Descendientes([int]$raiz) {
  $todos = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue
  $pendientes = @($raiz); $hallados = @()
  while ($pendientes.Count -gt 0) {
    $p = $pendientes[0]; $pendientes = @($pendientes | Select-Object -Skip 1)
    foreach ($h in ($todos | Where-Object { $_.ParentProcessId -eq $p })) { $hallados += $h.ProcessId; $pendientes += $h.ProcessId }
  }
  return $hallados
}

$antes = @{}
$tAntes = Get-Date
$fin = (Get-Date).AddSeconds($Segundos)
while ((Get-Date) -lt $fin) {
  if ($PidTanda -gt 0 -and -not (Get-Process -Id $PidTanda -ErrorAction SilentlyContinue)) { break }
  $nota = ''; $grados = -1; $carga = -1
  try {
    $pedir = @($termica); if ($cpu) { $pedir += $cpu }
    foreach ($x in (Get-Counter -Counter $pedir -ErrorAction SilentlyContinue).CounterSamples) {
      if ($x.Path -like '*_tz.*') { $v = $x.CookedValue; if ($v -gt 1000) { $v = $v / 10 }; $grados = [math]::Round($v - 273.15, 1) }
      else { $carga = [math]::Round($x.CookedValue, 0) }
    }
  } catch { $nota = 'sin lectura' }

  $ahora = Get-Date
  $dt = ($ahora - $tAntes).TotalSeconds; if ($dt -le 0) { $dt = 1 }
  $grupos = @{}; $despues = @{}
  foreach ($p in @(Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*ms-playwright*' -or $_.ProcessName -eq 'node' })) {
    try { $seg = $p.TotalProcessorTime.TotalSeconds } catch { continue }
    $despues[$p.Id] = $seg
    $d = 0; if ($antes.ContainsKey($p.Id)) { $d = $seg - $antes[$p.Id] }
    if (-not $grupos.ContainsKey($p.ProcessName)) { $grupos[$p.ProcessName] = @(0, 0.0) }
    $grupos[$p.ProcessName][0] += 1; $grupos[$p.ProcessName][1] += $d
  }
  $antes = $despues; $tAntes = $ahora
  $procesos = ($grupos.GetEnumerator() | Sort-Object Name | ForEach-Object { "{0} x{1} = {2:N1}" -f $_.Name, $_.Value[0], ($_.Value[1] / $dt) }) -join ' | '

  $corta = ($grados -ge $CorteC)
  if ($corta) { $nota = "CORTE a $grados C" }
  # La linea se apunta ANTES de parar nada: quien lanza la tanda lee el CSV en cuanto la tanda muere, y tiene que
  # encontrar ya el corte escrito.
  "{0};{1};{2};{3};{4}" -f (Get-Date -Format 'HH:mm:ss'), $grados, $carga, $procesos, $nota | Out-File -FilePath $Salida -Append -Encoding ascii

  if ($corta) {
    # Cada muestra en el corte o por encima vuelve a parar la tanda: no basta con una vez.
    if ($PidTanda -gt 0) {
      $arbol = @(Descendientes $PidTanda | Where-Object { $_ -ne $PID })
      [array]::Reverse($arbol)
      foreach ($id in $arbol) { try { Stop-Process -Id $id -Force -Confirm:$false -ErrorAction Stop } catch {} }
    }
    Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*ms-playwright*' } | ForEach-Object { try { Stop-Process -Id $_.Id -Force -Confirm:$false -ErrorAction Stop } catch {} }
  }
}
