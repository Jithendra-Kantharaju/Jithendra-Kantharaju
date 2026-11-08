#!/usr/bin/env node

// Validate local README image paths and basic SVG safety.
// Both static and animated SVGs are allowed.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const assetsRoot = path.resolve(root, 'assets');
const readmePath = path.join(root, 'README.md');
const failures = [];

if (!fs.existsSync(readmePath)) {
  console.error('Missing README.md. Run this script from the repository root.');
  process.exit(1);
}

if (!fs.existsSync(assetsRoot)) {
  console.error('Missing assets directory.');
  process.exit(1);
}

const markdown = fs.readFileSync(readmePath, 'utf8');

const paths = [
  ...markdown.matchAll(/<img\s+[^>]*src="(assets\/[^"]+)"/g),
].map((match) => match[1]);

for (const relative of paths) {
  const absolute = path.resolve(root, relative);

  if (!absolute.startsWith(assetsRoot + path.sep)) {
    failures.push(`Unsafe asset path: ${relative}`);
  } else if (!fs.existsSync(absolute)) {
    failures.push(`Missing asset: ${relative}`);
  }
}

function scan(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? scan(entryPath) : [entryPath];
  });
}

const svg = scan(assetsRoot).filter((file) => file.endsWith('.svg'));

for (const file of svg) {
  const content = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);

  if (!content.includes('<svg') || !content.includes('</svg>')) {
    failures.push(`Malformed SVG root: ${relative}`);
  }

  if (/<script\b/i.test(content)) {
    failures.push(`Executable script not permitted: ${relative}`);
  }

  if (/<foreignObject\b/i.test(content)) {
    failures.push(`foreignObject not permitted: ${relative}`);
  }

  if (/data:image\//i.test(content) || /<image\b/i.test(content)) {
    failures.push(`Embedded profile/photo image not permitted: ${relative}`);
  }
}

if (fs.existsSync(path.join(root, 'site'))) {
  failures.push('Portfolio website or resume page should not be included');
}

if (fs.existsSync(path.join(assetsRoot, 'jithendra-portrait.jpg'))) {
  failures.push('Portrait file must not be included');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(
  `Validated ${paths.length} README image references and ${svg.length} SVG files.`,
);