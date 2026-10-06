import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { MotionPreferenceService } from './motion-preference.service';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

@Directive({
	selector: '[appTilt]',
	standalone: true,
	host: { class: 'tilt' },
})
export class TiltDirective implements OnInit, OnDestroy {
	@Input() tiltMax = 6;

	private readonly host: HTMLElement = inject(ElementRef).nativeElement;
	private readonly motion = inject(MotionPreferenceService);
	private readonly zone = inject(NgZone);
	private frame = 0;
	private cleanup: () => void = () => {};

	ngOnInit(): void {
		if (!this.motion.canHover() || this.motion.reducedMotion()) {
			return;
		}
		this.zone.runOutsideAngular(() => {
			const move = (event: PointerEvent) => {
				const rect = this.host.getBoundingClientRect();
				if (!rect.width || !rect.height) {
					return;
				}
				const x = clamp01((event.clientX - rect.left) / rect.width);
				const y = clamp01((event.clientY - rect.top) / rect.height);
				cancelAnimationFrame(this.frame);
				this.frame = requestAnimationFrame(() => this.apply(x, y));
			};
			const leave = () => {
				cancelAnimationFrame(this.frame);
				this.host.style.transform = '';
				this.host.style.setProperty('--glow-opacity', '0');
			};
			this.host.addEventListener('pointermove', move);
			this.host.addEventListener('pointerleave', leave);
			this.cleanup = () => {
				this.host.removeEventListener('pointermove', move);
				this.host.removeEventListener('pointerleave', leave);
			};
		});
	}

	ngOnDestroy(): void {
		cancelAnimationFrame(this.frame);
		this.cleanup();
	}

	private apply(x: number, y: number): void {
		const rotateX = (0.5 - y) * 2 * this.tiltMax;
		const rotateY = (x - 0.5) * 2 * this.tiltMax;
		this.host.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
		this.host.style.setProperty('--glow-x', `${(x * 100).toFixed(1)}%`);
		this.host.style.setProperty('--glow-y', `${(y * 100).toFixed(1)}%`);
		this.host.style.setProperty('--glow-opacity', '1');
	}
}
