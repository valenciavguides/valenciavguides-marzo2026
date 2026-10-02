const { ROOT, salida } = require('./lib.cjs');
const fs=require('fs'),path=require('path');
const it=JSON.parse(fs.readFileSync(salida('recursos.json'),'utf8'));
// 1) intervalos: setInterval sin id guardado o con id que nunca se limpia (por nombre de variable normalizado)
const clears=new Set(it.filter(i=>i.kind==='clearInterval').map(i=>i.idvar));
console.log('=== setInterval: id guardado y su clearInterval ===');
for(const i of it.filter(i=>i.kind==='setInterval')){
  const st=i.idvar? (clears.has(i.idvar)?'limpiable':'SIN clearInterval(mismo nombre)') : 'ID NO GUARDADO';
  console.log((i.rel+':'+i.line).padEnd(34),String(i.fn).padEnd(36),String(i.idvar).padEnd(34),st);
}
// 2) listeners en targets globales (document/window/globalThis/visualViewport/navigator.*/screen.*) sin remove pareado por (target,ev)
const adds=it.filter(i=>i.kind==='addEventListener'); const rems=it.filter(i=>i.kind==='removeEventListener');
const isGlobalTarget=t=>/^(document|window|globalThis|visualViewport|screen\.orientation|navigator\.serviceWorker|document\.body|document\.documentElement|navigator\.[a-zA-Z]+|globalThis\.visualViewport|globalThis\.screen\.orientation|window\.visualViewport|document\.fonts)$/.test(t);
const remKey=new Set(rems.map(r=>r.rel+'|'+r.target+'|'+r.ev));
console.log('\n=== addEventListener en targets de vida larga SIN removeEventListener (mismo fichero, target y evento) ===');
const grp={};
for(const a of adds.filter(a=>isGlobalTarget(a.target)&&!a.once)){
  const k=a.rel+'|'+a.target+'|'+a.ev; if(!remKey.has(k)) (grp[k] ||= []).push(a.line+'['+a.fn+']');
}
for(const [k,v] of Object.entries(grp).sort()) console.log(k.padEnd(78),v.length,v.slice(0,6).join(' '));
// 3) observers / audio / rAF
console.log('\n=== observers / audio / workers / markers ===');
for(const i of it.filter(i=>/^new /.test(i.kind))) console.log((i.rel+':'+i.line).padEnd(34),i.kind.padEnd(22),i.fn);
console.log('\nobserver.disconnect:',it.filter(i=>i.kind==='observer.disconnect').map(i=>i.rel+':'+i.line).join(' '));
console.log('\n=== map.on/off ===');
const mon=it.filter(i=>i.kind==='map.on'||i.kind==='map.once'), moff=it.filter(i=>i.kind==='map.off');
const offKey=new Set(moff.map(i=>i.rel+'|'+i.ev));
for(const i of mon) console.log((i.rel+':'+i.line).padEnd(34),i.kind.padEnd(10),String(i.ev).padEnd(20),offKey.has(i.rel+'|'+i.ev)?'(hay map.off del mismo evento)':'sin map.off');
console.log('\nraf:',it.filter(i=>i.kind==='raf').length,'caf:',it.filter(i=>i.kind==='caf').length);
