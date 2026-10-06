import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StartPageComponent } from './start-page.component';
import { installMockIntersectionObserver, provideMotionStub } from '../../shared/motion/testing/motion-testing';

describe('StartPageComponent', () => {
	let component: StartPageComponent;
	let fixture: ComponentFixture<StartPageComponent>;
	let restore: () => void;

	beforeEach(() => {
		restore = installMockIntersectionObserver();
		TestBed.configureTestingModule({
			imports: [StartPageComponent],
			providers: [provideRouter([]), provideMotionStub(true)],
			deferBlockBehavior: DeferBlockBehavior.Manual,
		});
		fixture = TestBed.createComponent(StartPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => restore());

	const el = () => fixture.nativeElement as HTMLElement;

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should not render a gradient text-fill heading in the hero', () => {
		const h1: HTMLElement = el().querySelector('.start-page-wrapper__title h1')!;
		expect(getComputedStyle(h1).webkitBackgroundClip).not.toBe('text');
	});

	it('keeps the SEO heading text unchanged', () => {
		expect(el().querySelector('h1')?.textContent).toContain('Profesjonalne Rozwiązania Webowe dla Twojego Biznesu');
	});

	it('renders the particle background and the typewriter in the hero', () => {
		expect(el().querySelector('.hero app-particle-field')).toBeTruthy();
		const typewriter = el().querySelector('.start-page-wrapper__sub-title app-typewriter');
		expect(typewriter).toBeTruthy();
		expect(typewriter?.querySelector('.visually-hidden')?.textContent).toContain('aplikacje webowe');
	});

	it('links the hero CTAs to the demo and the contact page', () => {
		const links = Array.from(el().querySelectorAll<HTMLAnchorElement>('.hero__actions a')).map((a) => a.getAttribute('href'));
		expect(links).toEqual(['/demo', '/contact']);
	});

	it('should render offer cards without stock videos, revealed and tilted', () => {
		expect(el().querySelectorAll('.start-page-wrapper__offer video').length).toBe(0);
		const items = el().querySelectorAll('.start-page-wrapper__offer .offer__item');
		expect(items.length).toBe(4);
		items.forEach((item) => {
			expect(item.classList).toContain('reveal');
			expect(item.classList).toContain('tilt');
		});
		expect(el().querySelectorAll('.start-page-wrapper__offer .offer__item .pi').length).toBe(4);
	});

	it('should render trust section as icon cards without background photos', () => {
		expect(el().querySelectorAll('.trust-image').length).toBe(0);
		expect(el().querySelectorAll('.start-page-wrapper__trust .trust__item').length).toBe(4);
	});

	it('should render 4 process steps on a revealable track', () => {
		const steps = el().querySelectorAll('.process-section .process-step');
		expect(steps.length).toBe(4);
		expect(steps[0].textContent).toContain('Brief');
		expect(el().querySelector('.process-section__steps')?.classList).toContain('reveal');
	});

	it('defers the stats section and the demo teaser until they scroll into view', async () => {
		expect(el().querySelector('.stats-placeholder')).toBeTruthy();
		expect(el().querySelector('app-stats-section')).toBeNull();
		const blocks = await fixture.getDeferBlocks();
		expect(el().querySelector('.teaser-placeholder')).toBeTruthy();
		expect(blocks.length).toBe(2);
	});

	it('should render testimonials with a quote and an author', () => {
		const cards = el().querySelectorAll('.testimonials-section .testimonial-card');
		expect(cards.length).toBe(component.testimonialPlaceholders.length);
		cards.forEach((card) => {
			expect(card.querySelector('p')?.textContent?.trim().length).toBeGreaterThan(0);
			expect(card.querySelector('span')?.textContent?.trim().length).toBeGreaterThan(0);
		});
	});
});
