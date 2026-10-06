import type { EChartsCoreOption } from 'echarts/core';
import { IndustryGroup } from '../../../../assets/content/stats/industries';
import { LighthouseScores } from '../../../../assets/content/stats/lighthouse';
import { ND_CHART_OTHER, ND_CHART_TEXT, ND_CHART_TEXT_STRONG, ND_STATUS } from '../../../shared/charts/nd-dark.theme';

export const OTHER_INDUSTRY_LABEL = 'Pozostałe';

const GAUGES: Array<{ key: keyof LighthouseScores; name: string; center: [string, string] }> = [
	{ key: 'performance', name: 'Wydajność', center: ['25%', '27%'] },
	{ key: 'accessibility', name: 'Dostępność', center: ['75%', '27%'] },
	{ key: 'bestPractices', name: 'Dobre praktyki', center: ['25%', '75%'] },
	{ key: 'seo', name: 'SEO', center: ['75%', '75%'] },
];

export function averageScores(sites: LighthouseScores[]): LighthouseScores {
	const avg = (key: keyof LighthouseScores) =>
		sites.length ? Math.round(sites.reduce((sum, s) => sum + s[key], 0) / sites.length) : 0;
	return {
		performance: avg('performance'),
		accessibility: avg('accessibility'),
		bestPractices: avg('bestPractices'),
		seo: avg('seo'),
	};
}

// Progi jak w Lighthouse: 90–100 dobry, 50–89 do poprawy, 0–49 słaby.
export function scoreColor(score: number): string {
	if (score >= 90) return ND_STATUS.good;
	if (score >= 50) return ND_STATUS.warning;
	return ND_STATUS.critical;
}

export function industryChartOptions(groups: IndustryGroup[], selected: string | null, others = 0): EChartsCoreOption {
	return {
		tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
		series: [
			{
				type: 'pie',
				radius: ['50%', '78%'],
				selectedMode: 'single',
				selectedOffset: 8,
				padAngle: 1,
				itemStyle: { borderRadius: 4 },
				label: { show: false },
				emphasis: { label: { show: true, fontSize: 14, color: ND_CHART_TEXT_STRONG, formatter: '{b}\n{c}' } },
				data: [
					...groups.map((group) => ({
						name: group.name,
						value: group.projects.length,
						selected: group.name === selected,
					})),
					...(others > 0
						? [
								{
									name: OTHER_INDUSTRY_LABEL,
									value: others,
									selected: false,
									select: { disabled: true },
									itemStyle: { color: ND_CHART_OTHER },
								},
							]
						: []),
				],
			},
		],
	};
}

export function lighthouseGaugeOptions(scores: LighthouseScores): EChartsCoreOption {
	return {
		series: GAUGES.map((gauge) => {
			const value = scores[gauge.key];
			return {
				type: 'gauge',
				center: gauge.center,
				radius: '44%',
				startAngle: 90,
				endAngle: -270,
				min: 0,
				max: 100,
				pointer: { show: false },
				progress: { show: true, roundCap: true, width: 8, itemStyle: { color: scoreColor(value) } },
				axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(255, 255, 255, 0.08)']] } },
				axisTick: { show: false },
				splitLine: { show: false },
				axisLabel: { show: false },
				// Podpis w środku pierścienia, pod wynikiem — nie wychodzi poza wykres.
				title: { offsetCenter: [0, '32%'], color: ND_CHART_TEXT, fontSize: 11 },
				detail: { offsetCenter: [0, '-12%'], color: ND_CHART_TEXT_STRONG, fontSize: 22, fontWeight: 700, formatter: '{value}' },
				data: [{ value, name: gauge.name }],
			};
		}),
	};
}
