import { TestBed } from '@angular/core/testing';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ChartCardComponent } from './chart-card.component';
import { provideMotionStub } from '../motion/testing/motion-testing';
import { waitUntil } from './testing/wait-until';

const OPTIONS = {
	xAxis: { type: 'category', data: ['a', 'b'] },
	yAxis: { type: 'value' },
	series: [{ type: 'bar', data: [1, 2] }],
};

describe('ChartCardComponent', () => {
	function create(reduced: boolean) {
		TestBed.configureTestingModule({ imports: [ChartCardComponent], providers: [provideMotionStub(reduced)] });
		const fixture = TestBed.createComponent(ChartCardComponent);
		fixture.componentRef.setInput('options', OPTIONS);
		fixture.componentRef.setInput('title', 'Sprzedaż');
		fixture.componentRef.setInput('height', 200);
		document.body.appendChild(fixture.nativeElement);
		fixture.detectChanges();
		return fixture;
	}

	afterEach(() => document.querySelectorAll('app-chart-card').forEach((node) => node.remove()));

	it('renders the title and an accessible chart container with the given height', () => {
		const fixture = create(false);
		const el: HTMLElement = fixture.nativeElement;
		expect(el.querySelector('.chart-card__title')?.textContent).toBe('Sprzedaż');
		const chart = el.querySelector('.chart-card__chart') as HTMLElement;
		expect(chart.getAttribute('role')).toBe('img');
		expect(chart.getAttribute('aria-label')).toBe('Sprzedaż');
		expect(chart.style.height).toBe('200px');
	});

	it('initialises ECharts and draws a canvas', async () => {
		const fixture = create(false);
		await waitUntil(() => !!fixture.nativeElement.querySelector('canvas'));
		expect(fixture.nativeElement.querySelector('canvas')).toBeTruthy();
	});

	it('merges option updates into the live chart instead of replacing its state (zoom, legend)', async () => {
		const fixture = create(false);
		const directive = fixture.debugElement.query((d) => !!d.injector.get(NgxEchartsDirective, null)).injector.get(NgxEchartsDirective);
		await waitUntil(() => !!(directive as unknown as { chart?: unknown }).chart);
		const chart = (directive as unknown as { chart: { setOption: (...args: unknown[]) => void } }).chart;
		const setOption = spyOn(chart, 'setOption').and.callThrough();
		const next = { ...OPTIONS, series: [{ type: 'bar', data: [3, 4] }] };
		fixture.componentRef.setInput('options', next);
		fixture.detectChanges();
		expect(setOption).toHaveBeenCalled();
		setOption.calls.all().forEach((call) => expect(call.args[1]).not.toBeTrue());
	});

	it('passes options through unchanged when motion is allowed', () => {
		const fixture = create(false);
		expect(fixture.componentInstance.effectiveOptions()).toBe(OPTIONS);
	});

	it('disables chart animation with reduced motion', () => {
		const fixture = create(true);
		expect(fixture.componentInstance.effectiveOptions()).toEqual({ ...OPTIONS, animation: false });
	});

	it('renders the title as h4 by default and at the requested heading level', () => {
		const fixture = create(false);
		expect(fixture.nativeElement.querySelector('h4.chart-card__title')).toBeTruthy();
		fixture.componentRef.setInput('titleLevel', 2);
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('h2.chart-card__title')?.textContent).toBe('Sprzedaż');
		expect(fixture.nativeElement.querySelector('h4')).toBeNull();
	});

	it('drops the card chrome in the bare variant', () => {
		const fixture = create(false);
		fixture.componentRef.setInput('variant', 'bare');
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('.chart-card--bare')).toBeTruthy();
	});
});
