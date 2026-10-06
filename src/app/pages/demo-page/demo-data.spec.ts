import {
	DemoDataset,
	ORDER_STATUSES,
	RECENT_ORDERS_COUNT,
	computeKpis,
	countByStatus,
	generateDataset,
	mulberry32,
	nextLiveOrder,
} from './demo-data';

const TODAY = new Date(2026, 9, 6, 12, 0, 0);

function expectInvoicesMatchOrders(dataset: DemoDataset): void {
	dataset.series.forEach((point, i) => {
		const bucket = dataset.invoices[i];
		expect(bucket.label).toBe(point.label);
		expect(bucket.paid + bucket.pending + bucket.overdue).toBe(point.orders);
		expect(bucket.paid).toBeGreaterThanOrEqual(0);
	});
}

describe('demo-data', () => {
	it('mulberry32 is deterministic and returns values in [0, 1)', () => {
		const a = mulberry32(42);
		const b = mulberry32(42);
		for (let i = 0; i < 100; i++) {
			const value = a();
			expect(value).toBe(b());
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThan(1);
		}
	});

	it('generates the same dataset for the same seed and a different one for another seed', () => {
		expect(generateDataset(1, '30d', TODAY)).toEqual(generateDataset(1, '30d', TODAY));
		expect(generateDataset(1, '30d', TODAY)).not.toEqual(generateDataset(2, '30d', TODAY));
	});

	it('creates one point per day or month depending on the range', () => {
		expect(generateDataset(1, '7d', TODAY).series.length).toBe(7);
		expect(generateDataset(1, '30d', TODAY).series.length).toBe(30);
		const year = generateDataset(1, '12m', TODAY);
		expect(year.series.length).toBe(12);
		expect(year.series[11].label).toBe('10.2026');
		expect(generateDataset(1, '7d', TODAY).series[6].label).toBe('06.10');
	});

	it('keeps invoices consistent with orders, values positive, 40 orders and 10 products', () => {
		for (const range of ['7d', '30d', '12m'] as const) {
			const dataset = generateDataset(7, range, TODAY);
			expectInvoicesMatchOrders(dataset);
			dataset.series.forEach((p) => {
				expect(p.orders).toBeGreaterThan(0);
				expect(p.revenue).toBeGreaterThan(0);
			});
			expect(dataset.orders.length).toBe(RECENT_ORDERS_COUNT);
			expect(dataset.stock.length).toBe(10);
		}
	});

	it('lists orders from newest to oldest', () => {
		const { orders } = generateDataset(3, '30d', TODAY);
		for (let i = 1; i < orders.length; i++) {
			expect(orders[i - 1].timestamp).toBeGreaterThan(orders[i].timestamp);
		}
	});

	it('has at least one product below its minimum stock for most seeds', () => {
		const withShortage = [1, 2, 3, 4, 5].filter((seed) =>
			generateDataset(seed, '30d', TODAY).stock.some((item) => item.quantity < item.minimum),
		);
		expect(withShortage.length).toBeGreaterThanOrEqual(3);
	});

	it('computes KPIs from the series and invoices', () => {
		const dataset = generateDataset(5, '30d', TODAY);
		const kpis = computeKpis(dataset);
		const orders = dataset.series.reduce((sum, p) => sum + p.orders, 0);
		const revenue = dataset.series.reduce((sum, p) => sum + p.revenue, 0);
		expect(kpis.orders).toBe(orders);
		expect(kpis.revenue).toBe(revenue);
		expect(kpis.avgOrderValue).toBe(Math.round(revenue / orders));
		expect(kpis.overdueInvoices).toBe(dataset.invoices.reduce((sum, b) => sum + b.overdue, 0));
		expect(kpis.ordersChange).toBe(Math.round(((orders - dataset.previous.orders) / dataset.previous.orders) * 1000) / 10);
	});

	it('counts statuses across all recent orders', () => {
		const counts = countByStatus(generateDataset(9, '30d', TODAY).orders);
		expect(ORDER_STATUSES.reduce((sum, s) => sum + counts[s], 0)).toBe(RECENT_ORDERS_COUNT);
	});

	it('live mode keeps a realistic mix of statuses by moving existing orders forward', () => {
		let dataset = generateDataset(11, '30d', TODAY);
		const rand = mulberry32(5);
		for (let i = 0; i < 100; i++) {
			dataset = nextLiveOrder(dataset, rand, TODAY.getTime() + 86_400_000);
		}
		const counts = countByStatus(dataset.orders);
		expect(counts.new).toBeLessThan(RECENT_ORDERS_COUNT / 2);
		expect(ORDER_STATUSES.filter((s) => counts[s] > 0).length).toBeGreaterThanOrEqual(3);
	});

	it('live orders never get a timestamp in the future', () => {
		let dataset = generateDataset(11, '7d', TODAY);
		const rand = mulberry32(6);
		const now = TODAY.getTime();
		for (let i = 0; i < 200; i++) {
			dataset = nextLiveOrder(dataset, rand, now);
		}
		dataset.orders.forEach((o) => expect(o.timestamp).toBeLessThanOrEqual(now));
		for (let i = 1; i < dataset.orders.length; i++) {
			expect(dataset.orders[i - 1].timestamp).toBeGreaterThanOrEqual(dataset.orders[i].timestamp);
		}
	});

	it('nextLiveOrder adds a new order without mutating the input and keeps totals consistent', () => {
		const dataset = generateDataset(11, '7d', TODAY);
		const snapshot = JSON.parse(JSON.stringify(dataset));
		const next = nextLiveOrder(dataset, mulberry32(99), TODAY.getTime() + 86_400_000);

		expect(dataset).toEqual(snapshot);
		expect(next.orders.length).toBe(RECENT_ORDERS_COUNT);
		expect(next.orders[0].status).toBe('new');
		expect(next.orders[0].timestamp).toBeGreaterThan(dataset.orders[0].timestamp);
		expect(next.orders[0].id).not.toBe(dataset.orders[0].id);
		expect(next.orders[1].id).toBe(dataset.orders[0].id);
		expect(computeKpis(next).orders).toBe(computeKpis(dataset).orders + 1);
		expect(computeKpis(next).revenue).toBe(computeKpis(dataset).revenue + next.orders[0].amount);
		expectInvoicesMatchOrders(next);
	});
});
