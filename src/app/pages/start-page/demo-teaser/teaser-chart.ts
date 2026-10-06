import type { EChartsCoreOption } from 'echarts/core';
import { ND_CHART_PALETTE } from '../../../shared/charts/nd-dark.theme';

export const TEASER_POINTS = 20;
export const TEASER_INTERVAL_MS = 2000;
const MIN = 5;
const MAX = 60;

export function nextTeaserValue(last: number, rand: () => number): number {
	const next = Math.round(last + (rand() - 0.45) * 12);
	return Math.min(MAX, Math.max(MIN, next));
}

export function initialTeaserPoints(rand: () => number): number[] {
	const points = [25];
	while (points.length < TEASER_POINTS) {
		points.push(nextTeaserValue(points[points.length - 1], rand));
	}
	return points;
}

export function teaserLineOptions(points: number[]): EChartsCoreOption {
	return {
		grid: { left: 32, right: 8, top: 16, bottom: 24 },
		tooltip: { trigger: 'axis', formatter: '{c} zamówień' },
		xAxis: { type: 'category', boundaryGap: false, axisLabel: { show: false }, data: points.map((_, i) => i) },
		yAxis: { type: 'value', min: 0, max: MAX },
		series: [
			{
				type: 'line',
				smooth: true,
				showSymbol: false,
				lineStyle: { width: 3, color: ND_CHART_PALETTE[1] },
				areaStyle: { color: ND_CHART_PALETTE[0], opacity: 0.2 },
				data: points,
			},
		],
	};
}
