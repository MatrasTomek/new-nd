export type DemoRange = '7d' | '30d' | '12m';
export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered';

export const ORDER_STATUSES: readonly OrderStatus[] = ['new', 'processing', 'shipped', 'delivered'];
export const STATUS_LABELS: Record<OrderStatus, string> = {
	new: 'Nowe',
	processing: 'W realizacji',
	shipped: 'Wysłane',
	delivered: 'Dostarczone',
};
export const RANGE_LABELS: Record<DemoRange, string> = { '7d': '7 dni', '30d': '30 dni', '12m': '12 miesięcy' };
export const RECENT_ORDERS_COUNT = 40;

export interface TimePoint {
	label: string;
	orders: number;
	revenue: number;
}

export interface InvoiceBucket {
	label: string;
	paid: number;
	pending: number;
	overdue: number;
}

export interface StockItem {
	product: string;
	quantity: number;
	minimum: number;
}

export interface DemoOrder {
	id: string;
	customer: string;
	timestamp: number;
	date: string;
	amount: number;
	status: OrderStatus;
}

export interface DemoDataset {
	range: DemoRange;
	series: TimePoint[];
	previous: { orders: number; revenue: number };
	invoices: InvoiceBucket[];
	stock: StockItem[];
	orders: DemoOrder[];
}

export interface DemoKpis {
	revenue: number;
	orders: number;
	avgOrderValue: number;
	overdueInvoices: number;
	revenueChange: number;
	ordersChange: number;
	avgOrderValueChange: number;
}

// Fikcyjni klienci — celowo nie są to nazwy istniejących firm.
const CUSTOMERS = [
	'Alfa Sp. z o.o.',
	'Beta Serwis',
	'Gamma Trans',
	'Delta Budownictwo',
	'Sigma Handel',
	'Kappa Studio',
	'Lambda Med',
	'Theta Druk',
	'Zeta Instal',
	'Jota Meble',
];

const PRODUCTS = [
	'Karton 40×30',
	'Folia stretch',
	'Taśma pakowa',
	'Paleta EUR',
	'Etykiety A6',
	'Wypełniacz',
	'Koperta bąbelkowa',
	'Skaner ręczny',
	'Drukarka etykiet',
	'Rękawice robocze',
];

interface RangeConfig {
	points: number;
	unit: 'day' | 'month';
	baseOrders: number;
}

const RANGE_CONFIG: Record<DemoRange, RangeConfig> = {
	'7d': { points: 7, unit: 'day', baseOrders: 24 },
	'30d': { points: 30, unit: 'day', baseOrders: 24 },
	'12m': { points: 12, unit: 'month', baseOrders: 720 },
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus> = {
	new: 'processing',
	processing: 'shipped',
	shipped: 'delivered',
	delivered: 'delivered',
};
const STATUS_ADVANCE_CHANCE = 0.15;

const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

export function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const pad = (value: number) => String(value).padStart(2, '0');
const between = (rand: () => number, min: number, max: number) => min + (max - min) * rand();
const intBetween = (rand: () => number, min: number, max: number) => Math.floor(between(rand, min, max + 1));
const pick = <T>(rand: () => number, items: readonly T[]): T => items[intBetween(rand, 0, items.length - 1)];

function pointDate(today: Date, unit: RangeConfig['unit'], offset: number): Date {
	return unit === 'day'
		? new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset)
		: new Date(today.getFullYear(), today.getMonth() - offset, 1);
}

function formatLabel(date: Date, unit: RangeConfig['unit']): string {
	return unit === 'day'
		? `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`
		: `${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

function formatDateTime(timestamp: number): string {
	const d = new Date(timestamp);
	return `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function orderId(year: number, sequence: number): string {
	return `ZAM/${year}/${String(sequence).padStart(5, '0')}`;
}

function nextOrderId(id: string): string {
	const slash = id.lastIndexOf('/');
	const sequence = Number(id.slice(slash + 1)) + 1;
	return `${id.slice(0, slash + 1)}${String(sequence).padStart(5, '0')}`;
}

function pickStatus(age: number, rand: () => number): OrderStatus {
	const score = rand() * 0.35 + age * 0.75;
	if (score < 0.2) return 'new';
	if (score < 0.45) return 'processing';
	if (score < 0.7) return 'shipped';
	return 'delivered';
}

function sumSeries(series: TimePoint[]): { orders: number; revenue: number } {
	return series.reduce((sum, p) => ({ orders: sum.orders + p.orders, revenue: sum.revenue + p.revenue }), {
		orders: 0,
		revenue: 0,
	});
}

const pctChange = (current: number, previous: number) =>
	previous ? Math.round(((current - previous) / previous) * 1000) / 10 : 0;

export function generateDataset(seed: number, range: DemoRange, today: Date): DemoDataset {
	const rand = mulberry32(seed);
	const config = RANGE_CONFIG[range];
	const series: TimePoint[] = [];
	const invoices: InvoiceBucket[] = [];

	for (let offset = config.points - 1; offset >= 0; offset--) {
		const date = pointDate(today, config.unit, offset);
		const progress = (config.points - 1 - offset) / Math.max(1, config.points - 1);
		const weekend = config.unit === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		const orders = Math.max(
			1,
			Math.round(config.baseOrders * (0.85 + 0.3 * progress) * (weekend ? 0.6 : 1) * between(rand, 0.8, 1.2)),
		);
		const label = formatLabel(date, config.unit);
		series.push({ label, orders, revenue: Math.round(orders * between(rand, 180, 260)) });

		const overdue = Math.round(orders * (1 - progress) * between(rand, 0, 0.08));
		const pending = Math.round((orders - overdue) * (0.1 + 0.6 * progress) * between(rand, 0.7, 1));
		invoices.push({ label, paid: orders - overdue - pending, pending, overdue });
	}

	const totals = sumSeries(series);
	const previous = {
		orders: Math.round(totals.orders * between(rand, 0.82, 1.05)),
		revenue: Math.round(totals.revenue * between(rand, 0.8, 1.05)),
	};

	const stock = PRODUCTS.map((product) => {
		const minimum = intBetween(rand, 5, 20) * 10;
		return { product, minimum, quantity: Math.round(minimum * between(rand, 0.3, 2.5)) };
	});

	const firstSequence = intBetween(rand, 4000, 6000);
	const orders: DemoOrder[] = [];
	let timestamp = today.getTime();
	for (let i = 0; i < RECENT_ORDERS_COUNT; i++) {
		timestamp -= 2 * HOUR_MS + intBetween(rand, 0, 120) * MINUTE_MS;
		orders.push({
			id: orderId(today.getFullYear(), firstSequence - i),
			customer: pick(rand, CUSTOMERS),
			timestamp,
			date: formatDateTime(timestamp),
			amount: Math.round(between(rand, 80, 1200)),
			status: pickStatus(i / (RECENT_ORDERS_COUNT - 1), rand),
		});
	}

	return { range, series, previous, invoices, stock, orders };
}

export function nextLiveOrder(dataset: DemoDataset, rand: () => number, now = Date.now()): DemoDataset {
	const latest = dataset.orders[0];
	// Czas nowego zamówienia nie wyprzedza „teraz”, nawet przy długo włączonym trybie na żywo.
	const timestamp = Math.max(latest.timestamp, Math.min(latest.timestamp + intBetween(rand, 1, 20) * MINUTE_MS, now));
	const order: DemoOrder = {
		id: nextOrderId(latest.id),
		customer: pick(rand, CUSTOMERS),
		timestamp,
		date: formatDateTime(timestamp),
		amount: Math.round(between(rand, 80, 1200)),
		status: 'new',
	};
	const last = dataset.series.length - 1;
	return {
		...dataset,
		series: dataset.series.map((p, i) =>
			i === last ? { ...p, orders: p.orders + 1, revenue: p.revenue + order.amount } : p,
		),
		invoices: dataset.invoices.map((b, i) => (i === last ? { ...b, pending: b.pending + 1 } : b)),
		// Istniejące zamówienia przechodzą do kolejnych etapów, więc rozkład statusów pozostaje realistyczny.
		orders: [
			order,
			...dataset.orders.map((o) =>
				o.status !== 'delivered' && rand() < STATUS_ADVANCE_CHANCE ? { ...o, status: NEXT_STATUS[o.status] } : o,
			),
		].slice(0, RECENT_ORDERS_COUNT),
	};
}

export function computeKpis(dataset: DemoDataset): DemoKpis {
	const { orders, revenue } = sumSeries(dataset.series);
	const avg = orders ? revenue / orders : 0;
	const previousAvg = dataset.previous.orders ? dataset.previous.revenue / dataset.previous.orders : 0;
	return {
		revenue,
		orders,
		avgOrderValue: Math.round(avg),
		overdueInvoices: dataset.invoices.reduce((sum, b) => sum + b.overdue, 0),
		revenueChange: pctChange(revenue, dataset.previous.revenue),
		ordersChange: pctChange(orders, dataset.previous.orders),
		avgOrderValueChange: pctChange(avg, previousAvg),
	};
}

export function countByStatus(orders: DemoOrder[]): Record<OrderStatus, number> {
	const counts: Record<OrderStatus, number> = { new: 0, processing: 0, shipped: 0, delivered: 0 };
	orders.forEach((order) => counts[order.status]++);
	return counts;
}
