# Configuración SSL/TLS para Valencia VGuides Backend

## 📋 Descripción

El servidor backend ahora soporta automáticamente:
- **Desarrollo**: HTTP en localhost:3001
- **Producción**: HTTPS con certificados SSL

## 🔧 Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

```env
NODE_ENV=production
DOMAIN=valenciavguides.es
CERT_PATH=./certs/cert.pem
KEY_PATH=./certs/key.pem
PORT=443  # Puerto estándar HTTPS
```

### 2. Obtener Certificados SSL

#### Opción A: Let's Encrypt (Recomendado - Producción)

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generar certificado
sudo certbot certonly --standalone -d valenciavguides.es

# Los certificados se guardan en:
# /etc/letsencrypt/live/valenciavguides.es/cert.pem
# /etc/letsencrypt/live/valenciavguides.es/privkey.pem

# Copiar a tu proyecto
sudo cp /etc/letsencrypt/live/valenciavguides.es/cert.pem ./certs/
sudo cp /etc/letsencrypt/live/valenciavguides.es/privkey.pem ./certs/key.pem
sudo chown $USER:$USER ./certs/*
```

#### Opción B: Certificados Autofirmados (Desarrollo/Testing)

```bash
# Crear directorio de certificados
mkdir -p certs

# Generar certificado autofirmado (válido 365 días)
openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes

# En la prompts, puedes usar:
# Country: ES
# State: Valencia
# City: Valencia
# Organization: Valencia VGuides
# Common Name: valenciavguides.es
```

#### Opción C: Usando Heroku (Cloud)

Si usas Heroku, no necesitas certificados locales:
- Heroku proporciona SSL automático
- Establece `NODE_ENV=production`
- Usa `PORT=process.env.PORT || 3001`

### 3. Estructura de Directorios Esperada

```
backend/
├── server.js
├── .env
├── package.json
├── certs/
│   ├── cert.pem (Certificado)
│   └── key.pem  (Clave privada)
├── routes/
├── middleware/
├── services/
├── utils/
└── data/
```

## 🚀 Iniciar el Servidor

### Desarrollo
```bash
npm install
npm run dev
# ✅ Servidor HTTP en http://localhost:3001
```

### Producción (con certificados)
```bash
NODE_ENV=production DOMAIN=valenciavguides.es npm start
# ✅ Servidor HTTPS en https://valenciavguides.es
```

## 📊 Logs del Servidor

### Desarrollo
```
╔══════════════════════════════════════════════════╗
║  Valencia VGuides - Backend API (Desarrollo)     ║
╠══════════════════════════════════════════════════╣
║  🚀 Servidor corriendo en: http://localhost:3001║
║  📊 Entorno: Desarrollo                          ║
║  📚 Documentación API: /api/health               ║
╚══════════════════════════════════════════════════╝
```

### Producción con HTTPS
```
╔══════════════════════════════════════════════════╗
║  Valencia VGuides - Backend API (HTTPS)          ║
╠══════════════════════════════════════════════════╣
║  🚀 Servidor HTTPS en: https://valenciavguides.es
║  📊 Entorno: Producción (HTTPS Seguro)           ║
║  🔐 Certificado SSL: Activo                      ║
║  📚 Documentación: /api/health                   ║
╚══════════════════════════════════════════════════╝
```

## ✅ Validación

### Probar en Desarrollo
```bash
curl -X GET http://localhost:3001/api/health
```

### Probar en Producción
```bash
curl -X GET https://valenciavguides.es/api/health
# O con verificación de certificado:
curl --cacert ./certs/cert.pem https://valenciavguides.es/api/health
```

### Verificar CORS
```bash
curl -X OPTIONS https://valenciavguides.es/api/aventuras \
  -H "Origin: https://valenciavguides.es" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

## 🔍 Troubleshooting

### Error: "EACCES: permission denied" en certs
```bash
# Cambiar permisos
chmod 644 certs/cert.pem
chmod 600 certs/key.pem

# O cambiar propietario (si es necesario)
sudo chown -R $USER:$USER certs/
```

### Error: "Certificate has expired"
```bash
# Renovar certificado Let's Encrypt
sudo certbot renew --force-renewal

# O generar nuevo autofirmado
rm -f certs/*.pem
openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes
```

### CORS rechazado para ciertos orígenes
- Verificar variable DOMAIN en `.env`
- Revisar errores en logs del servidor
- Agregar origen en `corsOptions.allowedOrigins` si es necesario

### El servidor sigue usando HTTP aunque esté en producción
1. Verificar que `NODE_ENV=production`
2. Verificar que los certificados existen en las rutas configuradas
3. Ver los logs del servidor para mensajes de error

## 📚 Referencias

- [Node.js HTTPS Documentation](https://nodejs.org/api/https.html)
- [Let's Encrypt](https://letsencrypt.org/)
- [OpenSSL Commands](https://www.openssl.org/docs/man1.1.1/)
- [CORS MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 🔐 Checklist de Seguridad

- [ ] `NODE_ENV` establecido correctamente según entorno
- [ ] Certificados SSL presentes en producción
- [ ] `.env` no está en control de versiones (verificar `.gitignore`)
- [ ] `DOMAIN` variable configurada correctamente
- [ ] CORS lista de orígenes revisada
- [ ] Rate limiting activo
- [ ] Helmet headers configurados
- [ ] CSP headers correctos en frontend
- [ ] HSTS header presente en frontend
