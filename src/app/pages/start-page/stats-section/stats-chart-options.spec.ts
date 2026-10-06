import { averageScores, industryChartOptions, lighthouseGaugeOptions, scoreColor } from './stats-chart-options';
import { IndustryGroup } from '../../../../assets/content/stats/industries';
import { ND_CHART_OTHER, ND_STATUS } from '../../../shared/charts/nd-dark.theme';

/* eslint-disable @typescript-eslint/no-explicit-any */
const groups: IndustryGroup[] = [
	{ name: 'A', projects: [{ id: 'a1', label: 'A1' }, { id: 'a2', label: 'A2' }] },
	{ name: 'B', projects: [{ id: 'b1', label: 'B1' }] },
];

describe('stats-chart-options', () => {
	it('averages and rounds Lighthouse scores', () => {
		expect(
			averageScores([
				{ performance: 90, accessibility: 100, bestPractices: 95, seo: 91 },
				{ performance: 81, accessibility: 90, bestPractices: 100, seo: 100 },
			]),
		).toEqual({ performance: 86, accessibility: 95, bestPractices: 98, seo: 96 });
	});

	it('colours scores by Lighthouse bands using the reserved status colours', () => {
		expect(scoreColor(90)).toBe(ND_STATUS.good);
		expect(scoreColor(100)).toBe(ND_STATUS.good);
		expect(scoreColor(50)).toBe(ND_STATUS.warning);
		expect(scoreColor(89)).toBe(ND_STATUS.warning);
		expect(scoreColor(49)).toBe(ND_STATUS.critical);
	});

	it('industryChartOptions counts projects per industry and offsets the selected slice', () => {
		const o = industryChartOptions(groups, 'B') as any;
		const data = o.series[0].data;
		expect(data.map((d: any) => [d.name, d.value])).toEqual([
			['A', 2],
			['B', 1],
		]);
		expect(data[1].selected).toBeTrue();
		expect(data[0].selected).toBeFalse();
	});

	it('industryChartOptions adds a neutral "Pozostałe" slice for projects outside the listed industries', () => {
		const o = industryChartOptions(groups, null, 5) as any;
		const last = o.series[0].data.at(-1);
		expect(last.name).toBe('Pozostałe');
		expect(last.value).toBe(5);
		expect(last.itemStyle.color).toBe(ND_CHART_OTHER);
		expect(o.series[0].data.length).toBe(3);
	});

	it('industryChartOptions omits the "Pozostałe" slice when there are no other projects', () => {
		const o = industryChartOptions(groups, null, 0) as any;
		expect(o.series[0].data.map((d: any) => d.name)).toEqual(['A', 'B']);
	});

	it('lighthouseGaugeOptions keeps the bottom gauge titles inside the chart', () => {
		const o = lighthouseGaugeOptions({ performance: 1, accessibility: 1, bestPractices: 1, seo: 1 }) as any;
		o.series.forEach((s: any) => {
			const centerY = parseFloat(s.center[1]);
			const radius = parseFloat(s.radius);
			const titleOffset = parseFloat(s.title.offsetCenter[1]);
			// Środek podpisu (w % wysokości wykresu, promień liczony od mniejszego wymiaru ≤ wysokości) + margines na tekst.
			expect(centerY + (radius * titleOffset) / 100 + 6).toBeLessThanOrEqual(100);
		});
	});

	it('lighthouseGaugeOptions draws four gauges with the scores', () => {
		const o = lighthouseGaugeOptions({ performance: 91, accessibility: 88, bestPractices: 100, seo: 45 }) as any;
		expect(o.series.length).toBe(4);
		expect(o.series.map((s: any) => s.data[0].value)).toEqual([91, 88, 100, 45]);
		expect(o.series.map((s: any) => s.data[0].name)).toEqual(['Wydajność', 'Dostępność', 'Dobre praktyki', 'SEO']);
	});
});
