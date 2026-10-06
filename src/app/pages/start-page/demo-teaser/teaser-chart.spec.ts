import { TEASER_POINTS, initialTeaserPoints, nextTeaserValue, teaserLineOptions } from './teaser-chart';
import { mulberry32 } from '../../demo-page/demo-data';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('teaser-chart', () => {
	it('creates a deterministic series of TEASER_POINTS values', () => {
		expect(initialTeaserPoints(mulberry32(7))).toEqual(initialTeaserPoints(mulberry32(7)));
		expect(initialTeaserPoints(mulberry32(7)).length).toBe(TEASER_POINTS);
	});

	it('keeps the next value within bounds', () => {
		const rand = mulberry32(3);
		for (let i = 0; i < 200; i++) {
			const value = nextTeaserValue(i % 2 ? 5 : 60, rand);
			expect(value).toBeGreaterThanOrEqual(5);
			expect(value).toBeLessThanOrEqual(60);
		}
	});

	it('plots the points as a smooth line', () => {
		const o = teaserLineOptions([1, 2, 3]) as any;
		expect(o.series[0].type).toBe('line');
		expect(o.series[0].data).toEqual([1, 2, 3]);
	});
});
