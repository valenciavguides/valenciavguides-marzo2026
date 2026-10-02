const fs=require('fs'),path=require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn=require(path.join(ROOT,'node_modules/acorn'));
const ALL=['es','en','fr','it','nl','ja','de','zh','pl','pt','ru','uk'];
const files=[]; for(const f of fs.readdirSync(ROOT)) if(f.endsWith('.html')) files.push(f); for(const f of fs.readdirSync(path.join(ROOT,'js'))) if(f.endsWith('.js')&&!/^(audios|retos|textos|coordenadas|aventuras-ID)/.test(f)) files.push('js/'+f);
function blocksOf(rel,src){ if(!rel.endsWith('.html')) return [{code:src,off:0}]; const b=[]; const clean=src.replace(/<!--[\s\S]*?-->/g,c=>c.replace(/[^\n]/g,' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,(a,o,c,e)=>o+c.replace(/[^\n]/g,' ')+e); const re=/<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m; while((m=re.exec(clean))!==null){ const at=m[1]||''; if(/\bsrc\s*=/.test(at)) continue; const t=/type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty=t?t[1].toLowerCase():''; if(ty&&ty!=='module'&&ty!=='text/javascript'&&ty!=='application/javascript') continue; const cs=m.index+m[0].indexOf('>')+1; b.push({code:src.slice(cs,cs+m[2].length),off:src.slice(0,cs).split('\n').length-1}); } return b; }
function walk(n,v,ps){ if(!n||typeof n.type!=='string')return; v(n,ps); const np=ps.concat(n); for(const k of Object.keys(n)){ if(k==='type'||k==='start'||k==='end'||k==='loc')continue; const x=n[k]; if(Array.isArray(x)) x.forEach(c=>c&&typeof c.type==='string'&&walk(c,v,np)); else if(x&&typeof x.type==='string') walk(x,v,np);} }
function varName(ps){ for(let i=ps.length-1;i>=0;i--){ const p=ps[i]; if(p.type==='VariableDeclarator'&&p.id.type==='Identifier') return p.id.name; if(p.type==='Property'&&p.key) return String(p.key.name||p.key.value); if(p.type==='AssignmentExpression') return p.left.type==='MemberExpression'?(p.left.property.name||'?'):(p.left.name||'?'); } return '<anon>'; }
const out=[];
for(const rel of files){ const src=fs.readFileSync(path.join(ROOT,rel),'utf8').replace(/\r\n/g,'\n');
  for(const b of blocksOf(rel,src)){ let ast=null; for(const st of ['module','script']){ try{ ast=acorn.parse(b.code,{ecmaVersion:'latest',sourceType:st,locations:true,allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true}); break;}catch(e){} } if(!ast) continue;
    walk(ast,(n,ps)=>{
      if(n.type==='ObjectExpression'){ const keys=n.properties.filter(p=>p.type==='Property'&&!p.computed).map(p=>String(p.key.name||p.key.value)); const lang=keys.filter(k=>ALL.includes(k)); if(lang.length>=8) out.push({rel,line:n.loc.start.line+b.off,kind:'objeto',name:varName(ps),n:lang.length,missing:ALL.filter(k=>!lang.includes(k)),extra:keys.filter(k=>!ALL.includes(k)).length}); }
      if(n.type==='ArrayExpression'){ const vals=n.elements.filter(e=>e&&e.type==='Literal'&&typeof e.value==='string').map(e=>e.value); const lang=vals.filter(k=>ALL.includes(k)); if(lang.length>=8) out.push({rel,line:n.loc.start.line+b.off,kind:'array',name:varName(ps),n:lang.length,missing:ALL.filter(k=>!lang.includes(k)),extra:vals.length-lang.length}); }
    },[]);
  } }
// agrupar: solo los que NO son tablas grandes de traducciones (traducciones-ui) para ver listas/tablas dispersas
const byFile={}; for(const o of out) (byFile[o.rel] ||= []).push(o);
for(const [f,v] of Object.entries(byFile)){ console.log(f.padEnd(34),v.length,'estructuras indexadas por idioma'); if(f!=='js/traducciones-ui.js'&&f!=='js/terminos-aventuras.js'&&f!=='js/agradecimientos-aventuras.js') for(const o of v) console.log('    ',(o.rel+':'+o.line).padEnd(34),o.kind,o.name.padEnd(30),o.n+'/12',o.missing.length?('FALTAN '+o.missing.join(',')):'');}
