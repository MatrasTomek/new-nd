// Mierzy realizacje ND Lighthouse'em (mobile) i wypisuje medianę z RUNS przebiegów jako JSON.
// Użycie: RUNS=3 node scripts/measure-lighthouse.mjs > lighthouse-results.json
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SITES = [
	{ name: 'Stowarzyszenie Olimpijczyk', url: 'https://www.olimpijczyk-proszowki.pl/' },
	{ name: 'Przedszkole Mokrzyska', url: 'https://www.przedszkolemokrzyska.pl/' },
	{ name: 'Mawex', url: 'https://www.mawex-biuro.pl/' },
	{ name: 'OMEGA Dulowski', url: 'https://omega-dulowski.ovh/' },
	{ name: 'Parafia Mokrzyska', url: 'https://parafiamokrzyska.pl/' },
	{ name: 'Twoja Logistyka', url: 'https://www.twojalogistyka.com.pl/' },
	{ name: 'PostAI', url: 'https://www.developerweb.pl/' },
	{ name: 'Zawody sportowe', url: 'https://www.zawody.developerweb.pl/#/' },
];
const CATEGORIES = { performance: 'performance', accessibility: 'accessibility', bestPractices: 'best-practices', seo: 'seo' };
const RUNS = Number(process.env.RUNS ?? 3);
const dir = mkdtempSync(join(tmpdir(), 'nd-lighthouse-'));
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

const results = [];
for (const site of SITES) {
	const runs = [];
	for (let i = 0; i < RUNS; i++) {
		const output = join(dir, `${results.length}-${i}.json`);
		try {
			execFileSync(
				'npx',
				['--yes', 'lighthouse@13', site.url, '--quiet', '--output=json', `--output-path=${output}`, '--chrome-flags=--headless=new --no-sandbox'],
				{ stdio: 'ignore', env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? '/usr/bin/google-chrome' } },
			);
			const report = JSON.parse(readFileSync(output, 'utf8'));
			const scores = Object.fromEntries(
				Object.entries(CATEGORIES).map(([key, id]) => [key, report.categories[id]?.score]),
			);
			if (Object.values(scores).some((score) => typeof score !== 'number')) {
				throw new Error('missing category score');
			}
			runs.push(Object.fromEntries(Object.entries(scores).map(([key, score]) => [key, Math.round(score * 100)])));
		} catch (error) {
			console.error(`! ${site.name} — przebieg ${i + 1} nieudany: ${error.message}`);
		}
	}
	if (!runs.length) {
		console.error(`! ${site.name} — brak udanych przebiegów, pominięto`);
		continue;
	}
	results.push({
		...site,
		...Object.fromEntries(Object.keys(CATEGORIES).map((key) => [key, median(runs.map((run) => run[key]))])),
	});
	console.error(`✓ ${site.name}`);
}

console.log(JSON.stringify({ tool: 'Lighthouse 13', strategy: 'mobile', runs: RUNS, sites: results }, null, '\t'));
