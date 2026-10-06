import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CountUpDirective } from './count-up.directive';
import { MockIntersectionObserver, installMockIntersectionObserver, provideMotionStub } from './testing/motion-testing';

@Component({
	standalone: true,
	imports: [CountUpDirective],
	template: `<span [appCountUp]="value" [countUpDuration]="400" countUpSuffix=" zł"></span>`,
})
class HostComponent {
	value = 98;
}

describe('CountUpDirective', () => {
	let restore: () => void;

	beforeEach(() => (restore = installMockIntersectionObserver()));
	afterEach(() => restore());

	function create(reduced: boolean) {
		TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideMotionStub(reduced)] });
		const fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
		return { fixture, el: fixture.nativeElement.querySelector('span') as HTMLElement };
	}

	it('shows 0 before the element is visible', () => {
		const { el } = create(false);
		expect(el.textContent).toBe('0 zł');
	});

	it('animates to the target value after becoming visible', fakeAsync(() => {
		const { el } = create(false);
		MockIntersectionObserver.triggerAll(true);
		tick(200);
		const mid = Number(el.textContent!.replace(/\D/g, ''));
		expect(mid).toBeGreaterThan(0);
		expect(mid).toBeLessThan(98);
		tick(400);
		expect(el.textContent).toBe('98 zł');
	}));

	it('animates from the previous value when the input changes after being visible', fakeAsync(() => {
		const { fixture, el } = create(false);
		MockIntersectionObserver.triggerAll(true);
		tick(500);
		fixture.componentInstance.value = 14;
		fixture.detectChanges();
		tick(500);
		expect(el.textContent).toBe('14 zł');
	}));

	it('renders the final value immediately with reduced motion', () => {
		const { el } = create(true);
		expect(el.textContent).toBe('98 zł');
		expect(MockIntersectionObserver.instances.length).toBe(0);
	});
});
