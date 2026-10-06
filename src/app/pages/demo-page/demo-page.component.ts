import { Component, DestroyRef, computed, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription, filter, interval } from 'rxjs';
import type { EChartsCoreOption } from 'echarts/core';
import { ChartCardComponent } from '../../shared/charts/chart-card.component';
import { ND_CHART_ALERT, ND_CHART_PALETTE } from '../../shared/charts/nd-dark.theme';
import { CountUpDirective } from '../../shared/motion/count-up.directive';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { MotionPreferenceService } from '../../shared/motion/motion-preference.service';
import {
	DemoRange,
	ORDER_STATUSES,
	OrderStatus,
	RANGE_LABELS,
	STATUS_LABELS,
	computeKpis,
	countByStatus,
	generateDataset,
	nextLiveOrder,
} from './demo-data';
import {
	OrderSort,
	OrderSortKey,
	filterOrders,
	invoicesOptions,
	revenueOrdersOptions,
	sparklineOptions,
	statusOptions,
	stockOptions,
} from './demo-chart-options';

export const LIVE_INTERVAL_MS = 2000;
const INITIAL_SEED = 20261006;

interface KpiTile {
	label: string;
	value: number;
	suffix: string;
	change: number | null;
	spark: EChartsCoreOption;
}

@Component({
	selector: 'app-demo-page',
	standalone: true,
	imports: [ChartCardComponent, CountUpDirective, RevealDirective, RouterLink],
	templateUrl: './demo-page.component.html',
	styleUrls: ['./demo-page.component.scss'],
})
export class DemoPageComponent {
	readonly ranges: DemoRange[] = ['7d', '30d', '12m'];
	readonly rangeLabels = RANGE_LABELS;
	readonly statuses = ORDER_STATUSES;
	readonly statusLabels = STATUS_LABELS;

	private readonly motion = inject(MotionPreferenceService);
	private readonly today = new Date();
	private readonly narrowQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(max-width: 639px)') : null;

	readonly range = signal<DemoRange>('30d');
	readonly seed = signal(INITIAL_SEED);
	readonly live = signal(false);
	readonly statusFilter = signal<OrderStatus | null>(null);
	readonly sort = signal<OrderSort>({ key: 'date', dir: 'desc' });
	readonly compact = signal(this.narrowQuery?.matches ?? false);
	readonly liveAvailable = computed(() => !this.motion.reducedMotion());

	readonly dataset = linkedSignal(() => generateDataset(this.seed(), this.range(), this.today));
	readonly kpis = computed(() => computeKpis(this.dataset()));
	readonly statusCounts = computed(() => countByStatus(this.dataset().orders));
	readonly visibleOrders = computed(() => filterOrders(this.dataset().orders, this.statusFilter(), this.sort()));

	readonly revenueChart = computed(() => revenueOrdersOptions(this.dataset().series, this.compact()));
	readonly statusChart = computed(() => statusOptions(this.statusCounts(), this.statusFilter()));
	readonly invoicesChart = computed(() => invoicesOptions(this.dataset().invoices));
	// Węższy computed: tryb na żywo nie zmienia magazynu, więc wykres nie jest przebudowywany co tick.
	private readonly stock = computed(() => this.dataset().stock);
	readonly stockChart = computed(() => stockOptions(this.stock(), this.compact()));

	readonly kpiTiles = computed<KpiTile[]>(() => {
		const k = this.kpis();
		const { series, invoices } = this.dataset();
		return [
			{
				label: 'Przychód',
				value: k.revenue,
				suffix: ' zł',
				change: k.revenueChange,
				spark: sparklineOptions(series.map((p) => p.revenue), ND_CHART_PALETTE[1]),
			},
			{
				label: 'Zamówienia',
				value: k.orders,
				suffix: '',
				change: k.ordersChange,
				spark: sparklineOptions(series.map((p) => p.orders), ND_CHART_PALETTE[0]),
			},
			{
				label: 'Średnia wartość zamówienia',
				value: k.avgOrderValue,
				suffix: ' zł',
				change: k.avgOrderValueChange,
				spark: sparklineOptions(
					series.map((p) => Math.round(p.revenue / p.orders)),
					ND_CHART_PALETTE[2],
				),
			},
			{
				label: 'Przeterminowane faktury',
				value: k.overdueInvoices,
				suffix: '',
				change: null,
				spark: sparklineOptions(invoices.map((b) => b.overdue), ND_CHART_ALERT),
			},
		];
	});

	constructor() {
		const destroyRef = inject(DestroyRef);
		let liveSubscription: Subscription | null = null;

		effect(() => {
			const running = this.live() && this.liveAvailable();
			untracked(() => {
				liveSubscription?.unsubscribe();
				liveSubscription = running
					? interval(LIVE_INTERVAL_MS)
							.pipe(filter(() => !document.hidden))
							.subscribe(() => this.dataset.update((d) => nextLiveOrder(d, Math.random)))
					: null;
			});
		});

		const onNarrowChange = (event: MediaQueryListEvent) => this.compact.set(event.matches);
		this.narrowQuery?.addEventListener('change', onNarrowChange);

		destroyRef.onDestroy(() => {
			liveSubscription?.unsubscribe();
			this.narrowQuery?.removeEventListener('change', onNarrowChange);
		});
	}

	setRange(range: DemoRange): void {
		this.range.set(range);
	}

	toggleLive(): void {
		if (this.liveAvailable()) {
			this.live.update((on) => !on);
		}
	}

	randomize(): void {
		this.seed.set(Math.floor(Math.random() * 1_000_000_000));
		this.statusFilter.set(null);
	}

	toggleStatus(status: OrderStatus): void {
		this.statusFilter.update((current) => (current === status ? null : status));
	}

	onStatusChartClick(event: { data?: unknown }): void {
		const status = (event.data as { status?: OrderStatus } | undefined)?.status;
		if (status) {
			this.toggleStatus(status);
		}
	}

	sortBy(key: OrderSortKey): void {
		this.sort.update((current) => ({
			key,
			dir: current.key === key && current.dir === 'desc' ? 'asc' : 'desc',
		}));
	}

	reload(): void {
		window.location.reload();
	}
}
