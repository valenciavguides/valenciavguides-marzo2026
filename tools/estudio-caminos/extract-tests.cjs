const fs=require('fs'),path=require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn=require(path.join(ROOT,'node_modules/acorn'));
const prodG=JSON.parse(fs.readFileSync(salida('globals.json'),'utf8'));
const prodF=JSON.parse(fs.readFileSync(salida('funciones.json'),'utf8'));
// nombres de producción: globals escritos + funciones con nombre
const prodNames=new Set();
for(const fr of Object.values(prodG.frames)) for(const n of Object.keys(fr.byName)) prodNames.add(n);
for(const f of prodF.functions) if(f.name&&f.name!=='<anon>') prodNames.add(f.name.replace(/^globalThis\./,'').split('.').pop());
const dir=path.join(ROOT,'tests/e2e');
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.js'));
function walk(n,v,ps){ if(!n||typeof n.type!=='string')return; v(n,ps); const np=ps.concat(n); for(const k of Object.keys(n)){ if(k==='type'||k==='start'||k==='end'||k==='loc')continue; const x=n[k]; if(Array.isArray(x)) x.forEach(c=>c&&typeof c.type==='string'&&walk(c,v,np)); else if(x&&typeof x.type==='string') walk(x,v,np);} }
const GL=new Set(['globalThis','window','self']);
const rows=[]; const routes=[]; const initscripts=[];
let nparsed=0;
for(const f of files){
  const src=fs.readFileSync(path.join(dir,f),'utf8');
  let ast=null; for(const st of ['module','script']){ try{ ast=acorn.parse(src,{ecmaVersion:'latest',sourceType:st,locations:true,allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true}); break;}catch(e){} }
  if(!ast){ console.log('NO PARSEA',f); continue; } nparsed++;
  walk(ast,(n,ps)=>{
    if(n.type==='AssignmentExpression'&&n.left.type==='MemberExpression'&&!n.left.computed&&n.left.object.type==='Identifier'&&GL.has(n.left.object.name)){
      const name=n.left.property.name; const rhs=n.right.type;
      rows.push({f,line:n.loc.start.line,name,rhs,prod:prodNames.has(name)});
    }
    if(n.type==='CallExpression'&&n.callee.type==='MemberExpression'&&!n.callee.computed){
      const m=n.callee.property.name;
      if(m==='route'||m==='unroute'){ routes.push({f,line:n.loc.start.line,url:n.arguments[0]&&(n.arguments[0].type==='Literal'?String(n.arguments[0].value):n.arguments[0].type)}); }
      if(m==='addInitScript'){ initscripts.push({f,line:n.loc.start.line}); }
    }
  },[]);
}
console.log('specs parseados',nparsed,'de',files.length);
// agrupar overrides de nombres de producción
const by={}; for(const r of rows.filter(r=>r.prod&&(r.rhs==='ArrowFunctionExpression'||r.rhs==='FunctionExpression'))) (by[r.name] ||= []).push(r.f+':'+r.line);
console.log('\n=== STUBS (asignación de función a un nombre que EXISTE en producción) por nombre ===');
for(const [k,v] of Object.entries(by).sort((a,b)=>b[1].length-a[1].length)) console.log(k.padEnd(40),v.length,v.slice(0,8).join(' '));
const byNonProdFn={}; for(const r of rows.filter(r=>!r.prod&&(r.rhs==='ArrowFunctionExpression'||r.rhs==='FunctionExpression'))) (byNonProdFn[r.name] ||= []).push(r.f+':'+r.line);
console.log('\n=== funciones asignadas a nombres que NO existen en producción (instrumental de test) ===');
for(const [k,v] of Object.entries(byNonProdFn).sort()) console.log(k.padEnd(40),v.length);
console.log('\nrutas interceptadas (page.route):',routes.length);
const rb={}; for(const r of routes) (rb[r.url] ||= []).push(r.f); for(const [k,v] of Object.entries(rb)) console.log(String(k).padEnd(60),new Set(v).size,'specs');
