import { TestBed } from '@angular/core/testing';
import { MotionPreferenceService } from './motion-preference.service';

type ChangeListener = (event: { matches: boolean }) => void;

function fakeMediaQuery(matches: boolean) {
	const listeners: ChangeListener[] = [];
	return {
		matches,
		addEventListener: (_type: string, listener: ChangeListener) => listeners.push(listener),
		removeEventListener: () => {},
		emit: (value: boolean) => listeners.forEach((listener) => listener({ matches: value })),
	};
}

describe('MotionPreferenceService', () => {
	it('reads prefers-reduced-motion and hover capability on creation', () => {
		const reduced = fakeMediaQuery(true);
		const hover = fakeMediaQuery(false);
		spyOn(window, 'matchMedia').and.callFake(((query: string) =>
			query.includes('reduced-motion') ? reduced : hover) as unknown as typeof window.matchMedia);

		const service = TestBed.inject(MotionPreferenceService);

		expect(service.reducedMotion()).toBeTrue();
		expect(service.canHover()).toBeFalse();
	});

	it('updates reducedMotion when the media query changes', () => {
		const reduced = fakeMediaQuery(false);
		spyOn(window, 'matchMedia').and.callFake(((query: string) =>
			query.includes('reduced-motion') ? reduced : fakeMediaQuery(true)) as unknown as typeof window.matchMedia);

		const service = TestBed.inject(MotionPreferenceService);
		expect(service.reducedMotion()).toBeFalse();

		reduced.emit(true);
		expect(service.reducedMotion()).toBeTrue();
	});
});
