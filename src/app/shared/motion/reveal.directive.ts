import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { MotionPreferenceService } from './motion-preference.service';
import { onFirstVisible } from './in-view';

@Directive({
	selector: '[appReveal]',
	standalone: true,
	host: { class: 'reveal' },
})
export class RevealDirective implements OnInit, OnDestroy {
	@Input() revealDelay = 0;

	private readonly host: HTMLElement = inject(ElementRef).nativeElement;
	private readonly motion = inject(MotionPreferenceService);
	private stop: () => void = () => {};

	ngOnInit(): void {
		this.host.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);
		const show = () => this.host.classList.add('is-visible');
		if (this.motion.reducedMotion()) {
			show();
			return;
		}
		this.stop = onFirstVisible(this.host, show, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
	}

	ngOnDestroy(): void {
		this.stop();
	}
}
