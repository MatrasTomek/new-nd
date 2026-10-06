import { ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DemoPageComponent, LIVE_INTERVAL_MS } from './demo-page.component';
import { installMockIntersectionObserver, provideMotionStub } from '../../shared/motion/testing/motion-testing';

describe('DemoPageComponent', () => {
	let restore: () => void;
	let fixture: ComponentFixture<DemoPageComponent>;
	let component: DemoPageComponent;

	function setup(reduced = false): void {
		TestBed.configureTestingModule({
			imports: [DemoPageComponent],
			providers: [provideRouter([]), provideMotionStub(reduced)],
			deferBlockBehavior: DeferBlockBehavior.Manual,
		});
		fixture = TestBed.createComponent(DemoPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}

	async function renderCharts(): Promise<void> {
		const [block] = await fixture.getDeferBlocks();
		await block.render(DeferBlockState.Complete);
		fixture.detectChanges();
	}

	const el = () => fixture.nativeElement as HTMLElement;

	beforeEach(() => (restore = installMockIntersectionObserver()));
	afterEach(() => restore());

	describe('page', () => {
		beforeEach(() => setup());

		it('labels the data as sample data generated in the browser', () => {
			expect(el().querySelector('h1')?.textContent).toContain('Demo');
			expect(el().textContent).toContain('Dane przykładowe');
		});

		it('switches the range and regenerates the series', () => {
			const button = Array.from(el().querySelectorAll<HTMLButtonElement>('.demo-controls__range button')).find(
				(b) => b.textContent?.trim() === '7 dni',
			)!;
			button.click();
			fixture.detectChanges();
			expect(component.range()).toBe('7d');
			expect(component.dataset().series.length).toBe(7);
			expect(button.getAttribute('aria-pressed')).toBe('true');
		});

		it('randomize changes the seed and clears the status filter', () => {
			const seed = component.seed();
			component.toggleStatus('new');
			component.randomize();
			expect(component.seed()).not.toBe(seed);
			expect(component.statusFilter()).toBeNull();
		});

		it('clicking the same status twice clears the filter', () => {
			component.toggleStatus('shipped');
			expect(component.statusFilter()).toBe('shipped');
			component.toggleStatus('shipped');
			expect(component.statusFilter()).toBeNull();
		});

		it('maps a donut click to the status filter', () => {
			component.onStatusChartClick({ data: { status: 'delivered' } } as never);
			expect(component.statusFilter()).toBe('delivered');
		});
	});

	describe('charts and table', () => {
		beforeEach(async () => {
			setup();
			await renderCharts();
		});

		it('renders KPI tiles, chart cards and 8 table rows', () => {
			expect(el().querySelectorAll('.kpi').length).toBe(4);
			expect(el().querySelectorAll('app-chart-card').length).toBeGreaterThanOrEqual(8);
			expect(el().querySelectorAll('.orders-table tbody tr').length).toBe(8);
		});

		it('never skips a heading level below the page title', () => {
			const levels = Array.from(el().querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) => Number(h.tagName[1]));
			levels.forEach((level, i) => {
				if (i > 0) {
					expect(level - levels[i - 1]).toBeLessThanOrEqual(1);
				}
			});
		});

		it('filters the table with the keyboard-accessible status buttons', () => {
			const button = Array.from(el().querySelectorAll<HTMLButtonElement>('.status-filter button')).find((b) =>
				b.textContent?.includes('Dostarczone'),
			)!;
			button.click();
			fixture.detectChanges();
			expect(button.getAttribute('aria-pressed')).toBe('true');
			el()
				.querySelectorAll('.orders-table tbody .badge')
				.forEach((badge) => expect(badge.textContent?.trim()).toBe('Dostarczone'));
		});

		it('shows a message when no order has the selected status', () => {
			const dataset = component.dataset();
			component.dataset.set({ ...dataset, orders: dataset.orders.map((o) => ({ ...o, status: 'delivered' as const })) });
			component.toggleStatus('new');
			fixture.detectChanges();
			expect(el().querySelector('.orders-table__empty')?.textContent).toContain('Brak zamówień o tym statusie');
		});

		it('sorts the table by amount when the column header is clicked', () => {
			const header = el().querySelector<HTMLButtonElement>('[data-sort="amount"]')!;
			header.click();
			fixture.detectChanges();
			const amounts = component.visibleOrders().map((o) => o.amount);
			expect(amounts).toEqual([...amounts].sort((a, b) => b - a));
		});
	});

	describe('live mode', () => {
		it('adds an order every interval while on and stops when switched off', fakeAsync(() => {
			setup();
			const before = component.kpis().orders;
			component.toggleLive();
			fixture.detectChanges();
			tick(LIVE_INTERVAL_MS);
			expect(component.kpis().orders).toBe(before + 1);

			component.toggleLive();
			fixture.detectChanges();
			tick(LIVE_INTERVAL_MS * 3);
			expect(component.kpis().orders).toBe(before + 1);
		}));

		it('does not rebuild charts whose data did not change on a live tick', fakeAsync(() => {
			setup();
			const stock = component.stockChart();
			component.toggleLive();
			fixture.detectChanges();
			tick(LIVE_INTERVAL_MS);
			expect(component.stockChart()).toBe(stock);
			component.toggleLive();
			fixture.detectChanges();
		}));

		it('does not add orders while the tab is hidden', fakeAsync(() => {
			setup();
			spyOnProperty(document, 'hidden').and.returnValue(true);
			const before = component.kpis().orders;
			component.toggleLive();
			fixture.detectChanges();
			tick(LIVE_INTERVAL_MS * 2);
			expect(component.kpis().orders).toBe(before);
			component.toggleLive();
			fixture.detectChanges();
		}));

		it('stops the interval when the page is destroyed', fakeAsync(() => {
			setup();
			component.toggleLive();
			fixture.detectChanges();
			tick(LIVE_INTERVAL_MS);
			fixture.destroy();
			// fakeAsync zgłosi błąd, jeśli interwał nadal by działał.
		}));

		it('is unavailable with reduced motion', fakeAsync(() => {
			setup(true);
			expect(component.liveAvailable()).toBeFalse();
			const before = component.kpis().orders;
			component.toggleLive();
			fixture.detectChanges();
			tick(LIVE_INTERVAL_MS * 2);
			expect(component.kpis().orders).toBe(before);
			expect(el().querySelector<HTMLButtonElement>('.demo-controls__live')?.disabled).toBeTrue();
		}));
	});
});
