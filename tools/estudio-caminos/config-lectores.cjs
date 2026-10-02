const fs=require('fs'),path=require('path');
const { pathToFileURL } = require('url');
const { ROOT, salida } = require('./lib.cjs');
(async()=>{
  const mod=await import(pathToFileURL(path.join(ROOT,'js/config.js')).href);
  const CONFIG=mod.CONFIG;
  const leaves=[];
  (function rec(o,p){ for(const [k,v] of Object.entries(o)){ const np=p.concat(k); if(v&&typeof v==='object'&&!Array.isArray(v)) rec(v,np); else leaves.push(np); } })(CONFIG,[]);
  // corpus de producción (sin config.js ni datos)
  const files=[]; for(const f of fs.readdirSync(ROOT)) if(f.endsWith('.html')||f==='sw.js') files.push(f);
  for(const f of fs.readdirSync(path.join(ROOT,'js'))) if(f.endsWith('.js')&&!/^(audios|retos|textos|coordenadas|aventuras-ID|traducciones-ui|config)/.test(f)) files.push('js/'+f);
  const corp=files.map(f=>({f,t:fs.readFileSync(path.join(ROOT,f),'utf8')}));
  const out=[];
  for(const p of leaves){
    const key=p[p.length-1];
    const re=new RegExp('(?<![A-Za-z0-9_$])'+key+'(?![A-Za-z0-9_$])','g');
    const hits=[];
    for(const {f,t} of corp){ let m; let n=0; const lines=t.split('\n'); lines.forEach((ln,i)=>{ if(re.test(ln)){ re.lastIndex=0; // excluir comentarios puros
        if(!/^\s*(\/\/|\*|\/\*)/.test(ln)) hits.push(f+':'+(i+1)); } re.lastIndex=0; }); }
    out.push({path:p.join('.'),key,n:hits.length,hits:hits.slice(0,6)});
  }
  for(const o of out) console.log(o.n===0?'SIN LECTOR ':'          ',o.path.padEnd(38),o.n, o.hits.join(' '));
})();
