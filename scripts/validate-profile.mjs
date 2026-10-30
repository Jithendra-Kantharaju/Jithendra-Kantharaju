#!/usr/bin/env node
// Zero-dependency quick check for GitHub README SVGs and asset paths.
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const markdown = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const paths = [...markdown.matchAll(/<img\s+[^>]*src="(assets\/[^"]+)"/g)].map(m=>m[1]);
const failures = [];
for (const relative of paths) {
  const absolute=path.resolve(root,relative);
  if(!absolute.startsWith(path.resolve(root,'assets')+path.sep)) failures.push(`Unsafe asset path: ${relative}`);
  else if(!fs.existsSync(absolute)) failures.push(`Missing asset: ${relative}`);
}
function scan(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?scan(path.join(dir,x.name)):[path.join(dir,x.name)]);}
const svg=scan(path.join(root,'assets')).filter(p=>p.endsWith('.svg'));
for(const p of svg){
  const s=fs.readFileSync(p,'utf8');
  if(!s.includes('<svg')||!s.includes('</svg>'))failures.push(`Malformed SVG root: ${p}`);
  if(!s.includes('animation:')&&!s.includes('<animate'))failures.push(`No motion: ${p}`);
  if(s.includes('<script'))failures.push(`Executable script not permitted: ${p}`);
}
if(fs.existsSync(path.join(root,'site')) || fs.existsSync(path.join(root,'site','resume.html')))failures.push('Portfolio website or resume page should not be included');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Validated ${paths.length} README image references and ${svg.length} animated SVG files.`);
