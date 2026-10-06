import type { EChartsCoreOption } from 'echarts/core';
import { ND_CHART_ALERT, ND_CHART_PALETTE, ND_CHART_TEXT, ND_STATUS } from '../../shared/charts/nd-dark.theme';
import { DemoOrder, InvoiceBucket, ORDER_STATUSES, OrderStatus, STATUS_LABELS, StockItem, TimePoint } from './demo-data';

export type OrderSortKey = 'date' | 'customer' | 'amount';

export interface OrderSort {
	key: OrderSortKey;
	dir: 'asc' | 'desc';
}

const formatThousands = (value: number) => (value >= 1000 ? `${Math.round(value / 1000)} tys.` : String(value));
const plNumber = new Intl.NumberFormat('pl-PL');
const formatPl = (value: number) => plNumber.format(value);

// Przychód i zamówienia mają różne skale, więc zamiast dwóch osi Y na jednym wykresie
// rysujemy dwa wykresy jeden nad drugim, ze wspólną osią czasu, zoomem i tooltipem.
export function revenueOrdersOptions(series: TimePoint[], compact: boolean): EChartsCoreOption {
	const labels = series.map((p) => p.label);
	const bottom = compact ? 24 : 64;
	return {
		tooltip: { trigger: 'axis', axisPointer: { link: [{ xAxisIndex: 'all' }] }, valueFormatter: formatPl },
		legend: { top: 0, data: ['Przychód', 'Zamówienia'] },
		grid: [
			{ left: 56, right: 16, top: 48, height: compact ? '38%' : '36%' },
			{ left: 56, right: 16, bottom, height: compact ? '34%' : '28%' },
		],
		xAxis: [
			{ type: 'category', gridIndex: 0, data: labels, axisLabel: { show: false } },
			{ type: 'category', gridIndex: 1, data: labels },
		],
		yAxis: [
			{ type: 'value', gridIndex: 0, name: 'zł', axisLabel: { formatter: formatThousands } },
			{ type: 'value', gridIndex: 1, name: 'szt.' },
		],
		dataZoom: compact
			? [{ type: 'inside', xAxisIndex: [0, 1] }]
			: [
					{ type: 'inside', xAxisIndex: [0, 1] },
					{ type: 'slider', xAxisIndex: [0, 1], height: 18, bottom: 12 },
				],
		series: [
			{
				name: 'Przychód',
				type: 'line',
				xAxisIndex: 0,
				yAxisIndex: 0,
				smooth: true,
				showSymbol: false,
				lineStyle: { width: 2 },
				itemStyle: { color: ND_CHART_PALETTE[1] },
				areaStyle: { opacity: 0.15 },
				data: series.map((p) => p.revenue),
			},
			{
				name: 'Zamówienia',
				type: 'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				barMaxWidth: 18,
				itemStyle: { color: ND_CHART_PALETTE[0], borderRadius: [4, 4, 0, 0] },
				data: series.map((p) => p.orders),
			},
		],
	};
}

export function statusOptions(counts: Record<OrderStatus, number>, active: OrderStatus | null): EChartsCoreOption {
	return {
		tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
		legend: { bottom: 0 },
		series: [
			{
				type: 'pie',
				radius: ['55%', '80%'],
				center: ['50%', '45%'],
				padAngle: 1,
				itemStyle: { borderRadius: 4 },
				label: { show: false },
				emphasis: { label: { show: true, fontSize: 16, formatter: '{b}\n{c}' } },
				data: ORDER_STATUSES.map((status, i) => ({
					name: STATUS_LABELS[status],
					value: counts[status],
					status,
					itemStyle: { color: ND_CHART_PALETTE[i], opacity: active && active !== status ? 0.35 : 1 },
				})),
			},
		],
	};
}

export function invoicesOptions(buckets: InvoiceBucket[]): EChartsCoreOption {
	const bar = (name: string, color: string, data: number[]) => ({
		name,
		type: 'bar',
		stack: 'invoices',
		barMaxWidth: 18,
		itemStyle: { color },
		data,
	});
	return {
		tooltip: { trigger: 'axis', valueFormatter: formatPl },
		legend: { top: 0 },
		grid: { left: 40, right: 16, top: 40, bottom: 24 },
		xAxis: { type: 'category', data: buckets.map((b) => b.label) },
		yAxis: { type: 'value' },
		series: [
			bar('Opłacone', ND_STATUS.good, buckets.map((b) => b.paid)),
			bar('Oczekujące', ND_STATUS.warning, buckets.map((b) => b.pending)),
			bar('Przeterminowane', ND_STATUS.critical, buckets.map((b) => b.overdue)),
		],
	};
}

export function stockOptions(stock: StockItem[], compact = false): EChartsCoreOption {
	// Najbardziej krytyczne (najniższy stosunek stanu do minimum) na górze wykresu = na końcu osi kategorii.
	const sorted = [...stock].sort((a, b) => b.quantity / b.minimum - a.quantity / a.minimum);
	return {
		tooltip: {
			trigger: 'axis',
			formatter: (params: Array<{ dataIndex: number }>) => {
				const item = sorted[params[0].dataIndex];
				const shortage = item.minimum - item.quantity;
				return [
					item.product,
					`Stan: ${item.quantity} szt.`,
					`Minimum: ${item.minimum} szt.`,
					...(shortage > 0 ? [`Do zamówienia: ${shortage} szt.`] : []),
				].join('<br/>');
			},
		},
		legend: { top: 0, data: ['Stan', 'Stan minimalny'] },
		grid: { left: 120, right: 16, top: 36, bottom: 24 },
		xAxis: { type: 'value', ...(compact ? { splitNumber: 3 } : {}) },
		yAxis: { type: 'category', data: sorted.map((s) => s.product) },
		series: [
			{
				name: 'Stan',
				type: 'bar',
				barMaxWidth: 14,
				itemStyle: { borderRadius: [0, 4, 4, 0] },
				data: sorted.map((s) => ({
					value: s.quantity,
					itemStyle: { color: s.quantity < s.minimum ? ND_CHART_ALERT : ND_CHART_PALETTE[0] },
				})),
			},
			{
				name: 'Stan minimalny',
				type: 'bar',
				barGap: '-100%',
				barMaxWidth: 14,
				z: 3,
				itemStyle: { color: 'transparent', borderColor: ND_CHART_TEXT, borderType: 'dashed', borderWidth: 1 },
				data: sorted.map((s) => s.minimum),
			},
		],
	};
}

export function sparklineOptions(values: number[], color: string): EChartsCoreOption {
	return {
		grid: { left: 0, right: 0, top: 4, bottom: 4 },
		tooltip: { show: false },
		xAxis: { type: 'category', show: false, boundaryGap: false, data: values.map((_, i) => i) },
		yAxis: { type: 'value', show: false, scale: true },
		series: [
			{
				type: 'line',
				smooth: true,
				showSymbol: false,
				lineStyle: { width: 2, color },
				areaStyle: { color, opacity: 0.15 },
				data: values,
			},
		],
	};
}

export function filterOrders(orders: DemoOrder[], status: OrderStatus | null, sort: OrderSort, limit = 8): DemoOrder[] {
	const direction = sort.dir === 'asc' ? 1 : -1;
	const compare = (a: DemoOrder, b: DemoOrder): number => {
		switch (sort.key) {
			case 'amount':
				return (a.amount - b.amount) * direction;
			case 'customer':
				return a.customer.localeCompare(b.customer, 'pl') * direction;
			default:
				return (a.timestamp - b.timestamp) * direction;
		}
	};
	return orders
		.filter((o) => !status || o.status === status)
		.sort(compare)
		.slice(0, limit);
}
