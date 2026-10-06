import { Injectable, Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MotionPreferenceService {
	private readonly reducedQuery = MotionPreferenceService.query('(prefers-reduced-motion: reduce)');
	private readonly hoverQuery = MotionPreferenceService.query('(hover: hover) and (pointer: fine)');
	private readonly reduced = signal(this.reducedQuery?.matches ?? false);

	readonly reducedMotion: Signal<boolean> = this.reduced.asReadonly();
	readonly canHover: Signal<boolean> = signal(this.hoverQuery?.matches ?? false).asReadonly();

	constructor() {
		this.reducedQuery?.addEventListener('change', (event) => this.reduced.set(event.matches));
	}

	private static query(media: string): MediaQueryList | null {
		return typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(media) : null;
	}
}
