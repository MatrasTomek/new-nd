import { DemoOrder, StockItem, generateDataset } from './demo-data';
import {
	filterOrders,
	invoicesOptions,
	revenueOrdersOptions,
	sparklineOptions,
	statusOptions,
	stockOptions,
} from './demo-chart-options';
import { ND_CHART_ALERT, ND_CHART_PALETTE, ND_STATUS } from '../../shared/charts/nd-dark.theme';

// Opcje ECharts są luźno typowane — w testach czytamy je jako any.
/* eslint-disable @typescript-eslint/no-explicit-any */
const TODAY = new Date(2026, 9, 6, 12, 0, 0);
const dataset = generateDataset(21, '30d', TODAY);

const order = (overrides: Partial<DemoOrder>): DemoOrder => ({
	id: 'ZAM/2026/00001',
	customer: 'Alfa Sp. z o.o.',
	timestamp: 0,
	date: '',
	amount: 100,
	status: 'new',
	...overrides,
});

describe('demo-chart-options', () => {
	it('revenueOrdersOptions stacks revenue (line) above orders (bars) in two grids with one y axis each', () => {
		const o = revenueOrdersOptions(dataset.series, false) as any;
		expect(o.grid.length).toBe(2);
		expect(o.xAxis.map((x: any) => x.gridIndex)).toEqual([0, 1]);
		expect(o.yAxis.map((y: any) => y.gridIndex)).toEqual([0, 1]);
		o.xAxis.forEach((x: any) => expect(x.data.length).toBe(30));
		const line = o.series.find((s: any) => s.type === 'line');
		const bar = o.series.find((s: any) => s.type === 'bar');
		expect([line.xAxisIndex, line.yAxisIndex]).toEqual([0, 0]);
		expect([bar.xAxisIndex, bar.yAxisIndex]).toEqual([1, 1]);
		expect(bar.data).toEqual(dataset.series.map((p) => p.orders));
		expect(line.data).toEqual(dataset.series.map((p) => p.revenue));
	});

	it('revenueOrdersOptions zooms both grids together and shows the slider only on wide screens', () => {
		const wide = revenueOrdersOptions(dataset.series, false) as any;
		const compact = revenueOrdersOptions(dataset.series, true) as any;
		wide.dataZoom.forEach((z: any) => expect(z.xAxisIndex).toEqual([0, 1]));
		expect(wide.dataZoom.some((z: any) => z.type === 'slider')).toBeTrue();
		expect(compact.dataZoom.some((z: any) => z.type === 'slider')).toBeFalse();
	});

	it('revenueOrdersOptions keeps the legend clear of the top grid and both grids within the chart on narrow screens', () => {
		for (const compact of [false, true]) {
			const o = revenueOrdersOptions(dataset.series, compact) as any;
			expect(o.grid[0].top).toBeGreaterThanOrEqual(48);
			const top = parseFloat(o.grid[0].height) + parseFloat(o.grid[1].height);
			expect(top).toBeGreaterThan(compact ? 70 : 60);
		}
	});

	it('formats tooltip values with Polish number formatting', () => {
		const pl = new Intl.NumberFormat('pl-PL');
		expect((revenueOrdersOptions(dataset.series, false) as any).tooltip.valueFormatter(12345)).toBe(pl.format(12345));
		expect((invoicesOptions(dataset.invoices) as any).tooltip.valueFormatter(12345)).toBe(pl.format(12345));
	});

	it('stockOptions uses fewer axis ticks on narrow screens so labels do not collide', () => {
		const stock: StockItem[] = [{ product: 'A', quantity: 300, minimum: 100 }];
		expect((stockOptions(stock, true) as any).xAxis.splitNumber).toBe(3);
		expect((stockOptions(stock, false) as any).xAxis.splitNumber).toBeUndefined();
	});

	it('statusOptions carries the status key and dims inactive slices', () => {
		const o = statusOptions({ new: 1, processing: 2, shipped: 3, delivered: 4 }, 'shipped') as any;
		const data = o.series[0].data;
		expect(data.map((d: any) => d.status)).toEqual(['new', 'processing', 'shipped', 'delivered']);
		expect(data.map((d: any) => d.value)).toEqual([1, 2, 3, 4]);
		expect(data[2].itemStyle.opacity).toBe(1);
		expect(data[0].itemStyle.opacity).toBeLessThan(1);
	});

	it('statusOptions shows all slices at full opacity without a filter', () => {
		const o = statusOptions({ new: 1, processing: 2, shipped: 3, delivered: 4 }, null) as any;
		o.series[0].data.forEach((d: any) => expect(d.itemStyle.opacity).toBe(1));
	});

	it('invoicesOptions stacks paid, pending and overdue per bucket in status colours', () => {
		const o = invoicesOptions(dataset.invoices) as any;
		expect(o.series.length).toBe(3);
		o.series.forEach((s: any) => expect(s.stack).toBe('invoices'));
		expect(o.series.map((s: any) => s.itemStyle.color)).toEqual([ND_STATUS.good, ND_STATUS.warning, ND_STATUS.critical]);
		expect(o.series[2].data).toEqual(dataset.invoices.map((b) => b.overdue));
	});

	it('stockOptions highlights products below minimum and sorts the most critical first', () => {
		const stock: StockItem[] = [
			{ product: 'A', quantity: 300, minimum: 100 },
			{ product: 'B', quantity: 20, minimum: 100 },
		];
		const o = stockOptions(stock) as any;
		// Oś kategorii poziomych słupków rysuje się od dołu, więc najbardziej krytyczny produkt jest ostatni.
		expect(o.yAxis.data).toEqual(['A', 'B']);
		const quantities = o.series[0].data;
		expect(quantities[1].itemStyle.color).toBe(ND_CHART_ALERT);
		expect(quantities[0].itemStyle.color).toBe(ND_CHART_PALETTE[0]);
		expect(o.series[1].data).toEqual([100, 100]);
		expect(o.series[1].barGap).toBe('-100%');
	});

	it('stockOptions tooltip lists how many units to reorder for products below minimum', () => {
		const o = stockOptions([{ product: 'B', quantity: 20, minimum: 100 }]) as any;
		expect(o.tooltip.formatter([{ dataIndex: 0 }])).toContain('Do zamówienia: 80 szt.');
	});

	it('sparklineOptions hides axes and tooltip', () => {
		const o = sparklineOptions([1, 2, 3], '#8b7bff') as any;
		expect(o.xAxis.show).toBeFalse();
		expect(o.yAxis.show).toBeFalse();
		expect(o.series[0].data).toEqual([1, 2, 3]);
	});

	it('filterOrders filters by status, sorts and limits', () => {
		const orders = [
			order({ id: '1', status: 'new', amount: 300, timestamp: 1 }),
			order({ id: '2', status: 'shipped', amount: 100, timestamp: 2 }),
			order({ id: '3', status: 'new', amount: 200, timestamp: 3 }),
		];
		expect(filterOrders(orders, 'new', { key: 'amount', dir: 'asc' }).map((o) => o.id)).toEqual(['3', '1']);
		expect(filterOrders(orders, null, { key: 'date', dir: 'desc' }).map((o) => o.id)).toEqual(['3', '2', '1']);
		expect(filterOrders(orders, null, { key: 'date', dir: 'desc' }, 2).length).toBe(2);
	});

	it('filterOrders returns an empty list when no order has the status', () => {
		expect(filterOrders([order({ status: 'new' })], 'delivered', { key: 'date', dir: 'desc' })).toEqual([]);
	});

	it('filterOrders does not mutate the input', () => {
		const orders = [order({ id: '1', timestamp: 1 }), order({ id: '2', timestamp: 2 })];
		filterOrders(orders, null, { key: 'date', dir: 'desc' });
		expect(orders.map((o) => o.id)).toEqual(['1', '2']);
	});
});
