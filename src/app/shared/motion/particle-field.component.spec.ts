import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ParticleFieldComponent } from './particle-field.component';
import { MockIntersectionObserver, installMockIntersectionObserver, provideMotionStub } from './testing/motion-testing';

@Component({
	standalone: true,
	imports: [ParticleFieldComponent],
	template: `<div style="position:relative;width:300px;height:200px"><app-particle-field></app-particle-field></div>`,
})
class HostComponent {}

describe('ParticleFieldComponent', () => {
	let restore: () => void;

	beforeEach(() => (restore = installMockIntersectionObserver()));
	afterEach(() => restore());

	function create(reduced: boolean) {
		TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideMotionStub(reduced)] });
		const fixture = TestBed.createComponent(HostComponent);
		document.body.appendChild(fixture.nativeElement);
		fixture.detectChanges();
		return fixture;
	}

	afterEach(() => document.querySelectorAll('[ng-version]').forEach((node) => node.remove()));

	it('renders a decorative canvas', () => {
		const fixture = create(true);
		const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('canvas');
		expect(canvas).toBeTruthy();
		expect(canvas.getAttribute('aria-hidden')).toBe('true');
		expect(canvas.width).toBeGreaterThan(0);
	});

	it('draws a single static frame with reduced motion and never starts a loop', () => {
		const raf = spyOn(window, 'requestAnimationFrame').and.callThrough();
		create(true);
		expect(raf).not.toHaveBeenCalled();
		expect(MockIntersectionObserver.instances.length).toBe(0);
	});

	it('runs only while visible and the document is not hidden', () => {
		const raf = spyOn(window, 'requestAnimationFrame').and.returnValue(1);
		const cancel = spyOn(window, 'cancelAnimationFrame');
		create(false);
		MockIntersectionObserver.triggerAll(true);
		expect(raf).toHaveBeenCalled();

		MockIntersectionObserver.triggerAll(false);
		expect(cancel).toHaveBeenCalled();
	});

	it('pauses when the tab becomes hidden', () => {
		const raf = spyOn(window, 'requestAnimationFrame').and.returnValue(1);
		const cancel = spyOn(window, 'cancelAnimationFrame');
		create(false);
		MockIntersectionObserver.triggerAll(true);
		expect(raf).toHaveBeenCalled();

		spyOnProperty(document, 'hidden').and.returnValue(true);
		document.dispatchEvent(new Event('visibilitychange'));
		expect(cancel).toHaveBeenCalled();
	});

	it('stops the loop and disconnects on destroy', () => {
		spyOn(window, 'requestAnimationFrame').and.returnValue(7);
		const cancel = spyOn(window, 'cancelAnimationFrame');
		const fixture = create(false);
		MockIntersectionObserver.triggerAll(true);
		fixture.destroy();
		expect(cancel).toHaveBeenCalledWith(7);
		expect(MockIntersectionObserver.instances[0].observed.size).toBe(0);
	});
});
