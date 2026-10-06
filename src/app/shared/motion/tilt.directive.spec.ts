import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TiltDirective } from './tilt.directive';
import { provideMotionStub } from './testing/motion-testing';

@Component({
	standalone: true,
	imports: [TiltDirective],
	template: `<div appTilt style="display:block;width:200px;height:100px">karta</div>`,
})
class HostComponent {}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

describe('TiltDirective', () => {
	function create(reduced: boolean, canHover: boolean): HTMLElement {
		TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideMotionStub(reduced, canHover)] });
		const fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
		const el: HTMLElement = fixture.nativeElement.querySelector('div');
		document.body.appendChild(fixture.nativeElement);
		return el;
	}

	function pointer(el: HTMLElement, type: string, xRatio: number, yRatio: number): void {
		const rect = el.getBoundingClientRect();
		el.dispatchEvent(
			new PointerEvent(type, { clientX: rect.left + rect.width * xRatio, clientY: rect.top + rect.height * yRatio }),
		);
	}

	afterEach(() => document.querySelectorAll('[ng-version]').forEach((node) => node.remove()));

	it('tilts towards the pointer and moves the glow', async () => {
		const el = create(false, true);
		pointer(el, 'pointermove', 1, 0);
		await nextFrame();
		const angle = (axis: string) => Number(new RegExp(`rotate${axis}\\(([-\\d.]+)deg\\)`).exec(el.style.transform)?.[1]);
		expect(angle('X')).toBeCloseTo(6, 1);
		expect(angle('Y')).toBeCloseTo(6, 1);
		expect(el.style.getPropertyValue('--glow-x')).toBe('100.0%');
		expect(el.style.getPropertyValue('--glow-opacity')).toBe('1');
	});

	it('resets on pointerleave', async () => {
		const el = create(false, true);
		pointer(el, 'pointermove', 0.2, 0.8);
		await nextFrame();
		el.dispatchEvent(new PointerEvent('pointerleave'));
		expect(el.style.transform).toBe('');
		expect(el.style.getPropertyValue('--glow-opacity')).toBe('0');
	});

	it('does nothing on devices without hover', async () => {
		const el = create(false, false);
		pointer(el, 'pointermove', 1, 0);
		await nextFrame();
		expect(el.style.transform).toBe('');
	});

	it('does nothing with reduced motion', async () => {
		const el = create(true, true);
		pointer(el, 'pointermove', 1, 0);
		await nextFrame();
		expect(el.style.transform).toBe('');
	});
});
