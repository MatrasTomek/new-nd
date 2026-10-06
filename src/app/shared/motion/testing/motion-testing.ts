import { Provider, signal } from '@angular/core';
import { MotionPreferenceService } from '../motion-preference.service';

export class MockIntersectionObserver {
	static instances: MockIntersectionObserver[] = [];
	readonly observed = new Set<Element>();

	constructor(
		private readonly callback: IntersectionObserverCallback,
		readonly options?: IntersectionObserverInit,
	) {
		MockIntersectionObserver.instances.push(this);
	}

	observe(el: Element): void {
		this.observed.add(el);
	}

	unobserve(el: Element): void {
		this.observed.delete(el);
	}

	disconnect(): void {
		this.observed.clear();
	}

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}

	trigger(el: Element, isIntersecting = true): void {
		const entry = { target: el, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 } as IntersectionObserverEntry;
		this.callback([entry], this as unknown as IntersectionObserver);
	}

	static triggerAll(isIntersecting = true): void {
		for (const observer of [...MockIntersectionObserver.instances]) {
			for (const el of [...observer.observed]) {
				observer.trigger(el, isIntersecting);
			}
		}
	}
}

export function installMockIntersectionObserver(): () => void {
	const original = window.IntersectionObserver;
	MockIntersectionObserver.instances = [];
	(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
	return () => {
		(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = original;
	};
}

export function provideMotionStub(reduced: boolean, canHover = true): Provider {
	return {
		provide: MotionPreferenceService,
		useValue: { reducedMotion: signal(reduced).asReadonly(), canHover: signal(canHover).asReadonly() },
	};
}
