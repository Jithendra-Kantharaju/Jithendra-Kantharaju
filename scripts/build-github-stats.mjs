#!/usr/bin/env node
/**
 * Draw a self-hosted, GitHub-compatible SVG using GitHub's public REST API.
 * Counts are real; the image is updated by a scheduled GitHub Actions workflow.
 * Primary languages are counted by public repository, not by lines of code.
 */
import fs from 'node:fs';
import path from 'node:path';

const login = process.env.GH_USERNAME || 'Jithendra-Kantharaju';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const output = process.env.STATS_OUTPUT_PATH || 'assets/github-stats.svg';

const headers = { 'Accept':'application/vnd.github+json', 'User-Agent':'github-profile-stats' };
if (token) headers['Authorization'] = `Bearer ${token}`;

async function getJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub REST ${res.status}: ${url}`);
  return res.json();
}
function xml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
const user = await getJSON(`https://api.github.com/users/${encodeURIComponent(login)}`);
if (!user || user.login?.toLowerCase() !== login.toLowerCase()) throw new Error('Unexpected GitHub API user response');
const repos = [];
for (let page = 1; page <= 12; page++) {
  const part = await getJSON(`https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=100&page=${page}&type=owner`);
  if (!Array.isArray(part)) throw new Error('Unexpected repository response');
  repos.push(...part);
  if (part.length < 100) break;
}
const actual = repos.filter(r => !r.fork && !r.archived);
const stars = repos.reduce((n,r)=>n + (r.stargazers_count || 0),0);
const forks = repos.reduce((n,r)=>n + (r.forks_count || 0),0);
const lang = new Map();
for (const repo of actual) if (repo.language) lang.set(repo.language,(lang.get(repo.language)||0)+1);
const ordered = [...lang.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
const max = Math.max(...ordered.map(([_,count])=>count),1);
const updated = new Date().toISOString().slice(0,10);
const metrics = [ ['PUBLIC REPOSITORIES',user.public_repos || 0], ['REPOSITORY STARS',stars], ['REPOSITORY FORKS',forks], ['FOLLOWERS',user.followers || 0] ];
const tiles = metrics.map(([label,v],i)=>{
  const x=47+i*281;
  return `<g><rect x="${x}" y="102" width="263" height="115" rx="12" fill="#111D39" stroke="#344976"/>
  <text x="${x+16}" y="137" font-family="monospace" fill="#A78BFA" font-size="13" letter-spacing="1.1">${xml(label)}</text>
  <text x="${x+16}" y="193" font-family="Arial,sans-serif" fill="#32E6F2" font-size="46" font-weight="700">${v.toLocaleString('en-US')}</text></g>`;
}).join('');
const bars = ordered.map(([language, count],i)=>{
  const y=266+i*27;
  return `<g><text x="48" y="${y+10}" fill="#C3D5EE" font-family="monospace" font-size="14">${xml(language)}</text>
  <rect x="240" y="${y-3}" width="690" height="16" rx="8" fill="#1B2D4F"/>
  <rect x="240" y="${y-3}" width="${Math.round(690*count/max)}" height="16" rx="8" fill="${i%2 ? '#A78BFA':'#32E6F2'}"/>
  <text x="947" y="${y+10}" fill="#B6C8E8" font-family="monospace" font-size="13">${count} repos</text></g>`;
}).join('');
const height=435;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}" role="img" aria-label="Real GitHub stats for ${xml(login)}; ${user.public_repos} public repositories, ${stars} stars, ${forks} forks, ${user.followers} followers, generated on ${updated}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#080F24"/><stop offset="1" stop-color="#1C1540"/></linearGradient></defs>
<rect width="1200" height="${height}" rx="18" fill="url(#bg)"/>
<rect x=".5" y=".5" width="1199" height="${height-1}" rx="17.5" fill="none" stroke="#375181"/>
<text x="48" y="53" fill="#32E6F2" font-family="monospace" font-size="15" letter-spacing="1.6">GITHUB ACCOUNT / VERIFIED FROM PUBLIC API</text>
<text x="48" y="85" fill="#ECF4FF" font-family="Arial,sans-serif" font-size="23" font-weight="700">Activity beyond the README</text>
${tiles}
<text x="47" y="248" fill="#A78BFA" font-family="monospace" font-size="12">TOP PRIMARY LANGUAGES · NON-FORK, NON-ARCHIVED PUBLIC REPOS</text>
${bars}
<text x="47" y="413" fill="#9DB0D0" font-family="monospace" font-size="12">Source: api.github.com/users/${xml(login)} · updated ${updated} · languages by repository count</text>
</svg>`;
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,svg,'utf8');
console.log(`Wrote ${output} for ${login}: ${repos.length} returned public repositories.`);
