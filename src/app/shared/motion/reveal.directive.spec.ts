import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RevealDirective } from './reveal.directive';
import { MockIntersectionObserver, installMockIntersectionObserver, provideMotionStub } from './testing/motion-testing';

@Component({
	standalone: true,
	imports: [RevealDirective],
	template: `<div appReveal [revealDelay]="160">treść</div>`,
})
class HostComponent {}

describe('RevealDirective', () => {
	let restore: () => void;

	beforeEach(() => (restore = installMockIntersectionObserver()));
	afterEach(() => restore());

	function create(reduced: boolean): HTMLElement {
		TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideMotionStub(reduced)] });
		const fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
		return fixture.nativeElement.querySelector('div');
	}

	it('adds the reveal class and the delay variable, hidden until visible', () => {
		const el = create(false);
		expect(el.classList).toContain('reveal');
		expect(el.classList).not.toContain('is-visible');
		expect(el.style.getPropertyValue('--reveal-delay')).toBe('160ms');
	});

	it('becomes visible once it enters the viewport and stops observing', () => {
		const el = create(false);
		MockIntersectionObserver.triggerAll(true);
		expect(el.classList).toContain('is-visible');
		expect(MockIntersectionObserver.instances[0].observed.size).toBe(0);
	});

	it('stays hidden when the intersection callback reports not intersecting', () => {
		const el = create(false);
		MockIntersectionObserver.triggerAll(false);
		expect(el.classList).not.toContain('is-visible');
	});

	it('is visible immediately with reduced motion and creates no observer', () => {
		const el = create(true);
		expect(el.classList).toContain('is-visible');
		expect(MockIntersectionObserver.instances.length).toBe(0);
	});
});
