import { Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { MotionPreferenceService } from './motion-preference.service';
import { onFirstVisible } from './in-view';

@Directive({
	selector: '[appCountUp]',
	standalone: true,
})
export class CountUpDirective implements OnInit, OnChanges, OnDestroy {
	@Input({ required: true }) appCountUp = 0;
	@Input() countUpDuration = 1200;
	@Input() countUpDecimals = 0;
	@Input() countUpSuffix = '';

	private readonly host: HTMLElement = inject(ElementRef).nativeElement;
	private readonly motion = inject(MotionPreferenceService);
	private readonly zone = inject(NgZone);
	private visible = false;
	private current = 0;
	private frame = 0;
	private stop: () => void = () => {};

	ngOnInit(): void {
		if (this.motion.reducedMotion()) {
			this.visible = true;
			this.render(this.appCountUp);
			return;
		}
		this.render(0);
		this.stop = onFirstVisible(this.host, () => {
			this.visible = true;
			this.animateTo(this.appCountUp);
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		const change = changes['appCountUp'];
		if (!change || change.firstChange || !this.visible) {
			return;
		}
		if (this.motion.reducedMotion()) {
			this.render(this.appCountUp);
		} else {
			this.animateTo(this.appCountUp);
		}
	}

	ngOnDestroy(): void {
		this.stop();
		cancelAnimationFrame(this.frame);
	}

	private animateTo(target: number): void {
		cancelAnimationFrame(this.frame);
		const from = this.current;
		const start = Date.now();
		this.zone.runOutsideAngular(() => {
			const step = () => {
				const progress = Math.min(1, (Date.now() - start) / this.countUpDuration);
				const eased = 1 - Math.pow(1 - progress, 3);
				this.render(from + (target - from) * eased);
				if (progress < 1) {
					this.frame = requestAnimationFrame(step);
				}
			};
			this.frame = requestAnimationFrame(step);
		});
	}

	private render(value: number): void {
		this.current = value;
		const formatted = new Intl.NumberFormat('pl-PL', {
			minimumFractionDigits: this.countUpDecimals,
			maximumFractionDigits: this.countUpDecimals,
		}).format(value);
		this.host.textContent = `${formatted}${this.countUpSuffix}`;
	}
}
