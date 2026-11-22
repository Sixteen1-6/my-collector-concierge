#!/usr/bin/env node
// Checks that the static site is not broken:
//   1. every local file an HTML page or the README points to exists
//   2. data/collection.json parses and has cards in it
//   3. every card in assets/data.js that claims a scan has the scan file
// No dependencies. Run from the repo root: node scripts/check-site.mjs
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import vm from 'node:vm';

const problems = [];
const note = (msg) => problems.push(msg);

const isLocal = (ref) =>
  ref &&
  !/^(https?:|mailto:|tel:|data:|#|\/\/)/i.test(ref) &&
  !/['+{}$]/.test(ref); // skip values built in JavaScript

function checkRefs(file, refs) {
  for (const raw of refs) {
    if (!isLocal(raw)) continue;
    const path = raw.split('#')[0].split('?')[0];
    if (!path) continue;
    const target = normalize(join(dirname(file), decodeURIComponent(path)));
    if (!existsSync(target)) note(`${file}: missing file ${raw}`);
  }
}

// 1. HTML pages and the README
for (const page of ['index.html', 'portal.html', 'jb/index.html']) {
  const html = readFileSync(page, 'utf8');
  const refs = [...html.matchAll(/\b(?:src|href)="([^"]*)"/g)].map((m) => m[1]);
  checkRefs(page, refs);
}
{
  const md = readFileSync('README.md', 'utf8');
  const refs = [
    ...[...md.matchAll(/\b(?:src|href)="([^"]*)"/g)].map((m) => m[1]),
    ...[...md.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]),
  ];
  checkRefs('README.md', refs);
}

// 2. The full ledger
let ledgerCount = 0;
try {
  const ledger = JSON.parse(readFileSync('data/collection.json', 'utf8'));
  const rows = Array.isArray(ledger) ? ledger : Object.values(ledger).find(Array.isArray) ?? [];
  ledgerCount = rows.length;
  if (ledgerCount === 0) note('data/collection.json: no card rows found');
} catch (err) {
  note(`data/collection.json: does not parse (${err.message})`);
}

// 3. Showcased cards and their scans
let photoCount = 0;
try {
  const src = readFileSync('assets/data.js', 'utf8');
  const box = vm.createContext({});
  vm.runInContext(`${src}\n;globalThis.__cards = typeof CC_PHOTO === 'undefined' ? null : CC_PHOTO;`, box, {
    timeout: 5000,
  });
  const cards = box.__cards;
  if (!Array.isArray(cards)) {
    note('assets/data.js: CC_PHOTO is missing or is not a list');
  } else {
    photoCount = cards.length;
    for (const c of cards) {
      if (c.ph && !existsSync(`cards/${c.i}.webp`)) note(`assets/data.js: card ${c.i} has no front scan cards/${c.i}.webp`);
      if (c.bk && !existsSync(`cards/${c.i}b.webp`)) note(`assets/data.js: card ${c.i} has no back scan cards/${c.i}b.webp`);
    }
  }
} catch (err) {
  note(`assets/data.js: does not run (${err.message})`);
}

if (problems.length) {
  console.error(`Site check failed with ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`Site check passed: ${ledgerCount} ledger cards, ${photoCount} showcased cards, all linked files present.`);
