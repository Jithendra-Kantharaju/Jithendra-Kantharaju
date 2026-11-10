#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const login = process.env.GH_USERNAME || 'Jithendra-Kantharaju';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const output = process.env.STATS_OUTPUT_PATH || 'assets/github-stats.svg';
const api = `https://api.github.com/users/${encodeURIComponent(login)}`;

const calendar = JSON.parse(fs.readFileSync('data/contributions.json', 'utf8'));
if (!Number.isInteger(calendar.total) || calendar.total < 0) {
  throw new Error('Expected a valid contribution total in data/contributions.json');
}

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'github-profile-stats',
};
if (token) headers.Authorization = `Bearer ${token}`;

async function getJSON(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${url}`);
  return response.json();
}

function xml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const user = await getJSON(api);
if (user.login?.toLowerCase() !== login.toLowerCase() ||
    !Number.isInteger(user.public_repos)) {
  throw new Error('Unexpected GitHub user response');
}

const languages = new Map();
for (let page = 1; ; page += 1) {
  const repos = await getJSON(`${api}/repos?per_page=100&page=${page}&type=owner`);
  if (!Array.isArray(repos)) throw new Error('Unexpected GitHub repository response');

  for (const repo of repos) {
    if (!repo.private && !repo.fork && !repo.archived && repo.language) {
      languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
    }
  }

  if (repos.length < 100) break;
}

const topLanguages = [...languages.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 5);
const maxCount = topLanguages[0]?.[1] ?? 1;

const metrics = [
  ['Public repositories', 'GitHub account', user.public_repos],
  ['Contributions', 'Last 12 months', calendar.total],
];

const cards = metrics.map(([label, caption, value], index) => `
  <g transform="translate(${28 + index * 429} 62)">
    <rect width="415" height="110" rx="12" fill="#111D39" stroke="#344976"/>
    <text x="16" y="28" class="label">${xml(label)}</text>
    <text x="16" y="49" class="caption">${xml(caption)}</text>
    <text x="16" y="92" class="number">${value.toLocaleString('en-US')}</text>
  </g>`).join('');

const bars = topLanguages.map(([language, count], index) => `
  <g transform="translate(0 ${223 + index * 24})">
    <text x="28" y="0" class="caption">${xml(language)}</text>
    <rect x="176" y="-10" width="644" height="10" rx="5" fill="#1B2D4F"/>
    <rect x="176" y="-10" width="${Math.round(644 * count / maxCount)}"
          height="10" rx="5" fill="${index % 2 ? '#A78BFA' : '#32E6F2'}"/>
    <text x="872" y="0" text-anchor="end" class="caption">${count}</text>
  </g>`).join('');

const height = 270 + Math.max(0, topLanguages.length - 1) * 24;
const fetchedDate = String(calendar.fetchedAt ?? '').slice(0, 10);
const calendarCaption = fetchedDate ? `Contribution data: ${fetchedDate}` : 'Contribution calendar';

const svg = `<svg xmlns="http://www.w3.org/2000/svg"
  width="900" height="${height}" viewBox="0 0 900 ${height}"
  role="img" aria-labelledby="title description">
  <title id="title">GitHub activity at a glance</title>
  <desc id="description">${xml(login)} has ${user.public_repos} public repositories
    and ${calendar.total} contributions in the last 12 months.</desc>

  <defs>
    <linearGradient id="bg" x2="100%" y2="100%">
      <stop stop-color="#080F24"/>
      <stop offset="1" stop-color="#1C1540"/>
    </linearGradient>
  </defs>

  <style>
    text { font-family: system-ui, sans-serif; }
    .heading { fill: #ECF4FF; font-size: 24px; font-weight: 700; }
    .label { fill: #C6B6F8; font-size: 17px; font-weight: 600; }
    .caption { fill: #B6C8E8; font-size: 15px; }
    .number { fill: #32E6F2; font-size: 36px; font-weight: 700; }
    @media (prefers-reduced-motion: no-preference) {
      .signal { animation: appear 1.4s ease-out both; }
    }
    @keyframes appear {
      from { opacity: .35; }
      to { opacity: 1; }
    }
  </style>

  <rect x=".5" y=".5" width="899" height="${height - 1}" rx="17.5"
        fill="url(#bg)" stroke="#375181"/>
  <text x="28" y="43" class="heading">GitHub activity at a glance</text>
  <circle cx="864" cy="35" r="4" fill="#32E6F2" class="signal"/>

  ${cards}

  <text x="28" y="199" class="label">Top primary languages by public repository count</text>
  ${bars || '<text x="28" y="224" class="caption">No language data available.</text>'}
  <text x="28" y="${height - 16}" class="caption">${xml(calendarCaption)}</text>
</svg>
`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, svg, 'utf8');
console.log(`Wrote ${output}: ${user.public_repos} public repos, ${calendar.total} contributions.`);