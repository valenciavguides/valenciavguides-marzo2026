const { ROOT, salida } = require('./lib.cjs');
const fs=require('fs'),path=require('path');
const d=JSON.parse(fs.readFileSync(salida('constantes.json'),'utf8'));
const mode=process.argv[2]||'decl';
if(mode==='decl'){
  // nombre idéntico (UPPER_CASE o camel) con VALORES distintos en ficheros distintos, o mismo valor bajo nombres distintos
  const byName={};
  for(const x of d.decl){ if(typeof x.val!=='number') continue; (byName[x.name] ||= []).push(x); }
  console.log('=== MISMO NOMBRE, VALORES DISTINTOS entre ficheros ===');
  for(const [n,xs] of Object.entries(byName).sort()){
    const vals=new Set(xs.map(x=>x.val)); const files=new Set(xs.map(x=>x.rel));
    if(vals.size>1 && files.size>1 && !/^(i|j|k|n|m|x|y|w|h|t|a|b|c|d|e|f|r|s|v|l|p|q|idx|len|ms|max|min|top|left|width|height|size|count|delay|lat|lng|opacity|zIndex|duration|offset|timeout)$/.test(n)) console.log(n.padEnd(34), xs.map(x=>`${x.rel}:${x.line}=${x.val}`).join('  '));
  }
}
if(mode==='nombrados'){
  // constantes con nombre MAYÚSCULAS: valor y sitios
  const up=d.decl.filter(x=>/^[A-Z][A-Z0-9_]{2,}$/.test(x.name));
  const byVal={};
  for(const x of up){ (byVal[x.val] ||= []).push(x); }
  for(const [v,xs] of Object.entries(byVal).sort((a,b)=>Number(a[0])-Number(b[0]))){
    const names=new Set(xs.map(x=>x.name)); const files=new Set(xs.map(x=>x.rel));
    if(names.size>1 || files.size>1) console.log(String(v).padStart(10),'→',xs.map(x=>`${x.name}@${x.rel}:${x.line}`).join('  '));
  }
}
