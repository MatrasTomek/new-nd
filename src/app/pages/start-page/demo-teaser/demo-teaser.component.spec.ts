import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DemoTeaserComponent } from './demo-teaser.component';
import { TEASER_INTERVAL_MS } from './teaser-chart';
import { MockIntersectionObserver, installMockIntersectionObserver, provideMotionStub } from '../../../shared/motion/testing/motion-testing';

describe('DemoTeaserComponent', () => {
	let restore: () => void;

	beforeEach(() => (restore = installMockIntersectionObserver()));
	afterEach(() => restore());

	function create(reduced: boolean) {
		TestBed.configureTestingModule({
			imports: [DemoTeaserComponent],
			providers: [provideRouter([]), provideMotionStub(reduced)],
		});
		// Wykres nie jest tu potrzebny — podmieniamy kartę na pusty szablon, żeby ECharts nie startował w fakeAsync.
		TestBed.overrideComponent(DemoTeaserComponent, {
			set: { imports: [], template: '<a href="/demo" class="teaser__cta">Otwórz demo</a>' },
		});
		const fixture = TestBed.createComponent(DemoTeaserComponent);
		fixture.detectChanges();
		return fixture;
	}

	it('adds a point every interval while visible, keeping a fixed window', fakeAsync(() => {
		const fixture = create(false);
		const before = fixture.componentInstance.points();
		MockIntersectionObserver.triggerAll(true);
		tick(TEASER_INTERVAL_MS);
		const after = fixture.componentInstance.points();
		expect(after.length).toBe(before.length);
		expect(after.slice(0, -1)).toEqual(before.slice(1));
		fixture.destroy();
	}));

	it('does not update while scrolled out of view', fakeAsync(() => {
		const fixture = create(false);
		const before = fixture.componentInstance.points();
		MockIntersectionObserver.triggerAll(false);
		tick(TEASER_INTERVAL_MS * 2);
		expect(fixture.componentInstance.points()).toEqual(before);
		fixture.destroy();
	}));

	it('stays static with reduced motion', fakeAsync(() => {
		const fixture = create(true);
		const before = fixture.componentInstance.points();
		tick(TEASER_INTERVAL_MS * 2);
		expect(fixture.componentInstance.points()).toEqual(before);
		fixture.destroy();
	}));
});

describe('DemoTeaserComponent template', () => {
	it('links to the demo and renders the live chart card', () => {
		const restore = installMockIntersectionObserver();
		TestBed.configureTestingModule({
			imports: [DemoTeaserComponent],
			providers: [provideRouter([]), provideMotionStub(true)],
		});
		const fixture = TestBed.createComponent(DemoTeaserComponent);
		fixture.detectChanges();
		const el = fixture.nativeElement as HTMLElement;
		expect(el.querySelector('.teaser__cta')?.getAttribute('href')).toBe('/demo');
		expect(el.querySelector('app-chart-card')).toBeTruthy();
		fixture.destroy();
		restore();
	});
});
