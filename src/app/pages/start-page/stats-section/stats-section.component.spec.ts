import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StatsSectionComponent } from './stats-section.component';
import { installMockIntersectionObserver, provideMotionStub } from '../../../shared/motion/testing/motion-testing';
import { lighthouseReport } from '../../../../assets/content/stats/lighthouse';
import { averageScores } from './stats-chart-options';
import { ND_CHART_PALETTE } from '../../../shared/charts/nd-dark.theme';

describe('StatsSectionComponent', () => {
	let fixture: ComponentFixture<StatsSectionComponent>;
	let restore: () => void;
	const el = () => fixture.nativeElement as HTMLElement;
	const button = (selector: string, text: string) =>
		Array.from(el().querySelectorAll<HTMLButtonElement>(selector)).find((b) => b.textContent?.includes(text))!;

	beforeEach(() => {
		restore = installMockIntersectionObserver();
		TestBed.configureTestingModule({
			imports: [StatsSectionComponent],
			providers: [provideRouter([]), provideMotionStub(true)],
		});
		fixture = TestBed.createComponent(StatsSectionComponent);
		fixture.detectChanges();
	});

	afterEach(() => restore());

	it('shows project, industry and average SEO counters', () => {
		const values = Array.from(el().querySelectorAll('.stats__value')).map((v) => v.textContent?.trim());
		expect(values[0]).toBe('14');
		expect(values[1]).toBe('6');
		expect(values[2]).toBe(String(averageScores(lighthouseReport.sites).seo));
	});

	it('lists the projects of an industry selected with the keyboard-accessible chips', () => {
		const chip = button('.stats__chips--industries button', 'Logistyka i transport');
		chip.click();
		fixture.detectChanges();
		expect(chip.getAttribute('aria-pressed')).toBe('true');
		const items = Array.from(el().querySelectorAll('.stats__projects a')).map((a) => a.textContent?.trim());
		expect(items).toEqual(['Twoja Logistyka', 'OMEGA Dulowski']);
		expect(el().querySelector('.stats__projects a')?.getAttribute('href')).toBe('/projects');
	});

	it('ties each industry chip to its donut slice with a colour swatch', () => {
		const swatches = Array.from(el().querySelectorAll<HTMLElement>('.stats__chips--industries .stats__swatch'));
		expect(swatches.length).toBe(6);
		const probe = document.createElement('span');
		swatches.forEach((swatch, i) => {
			probe.style.background = ND_CHART_PALETTE[i];
			expect(swatch.style.background).toBe(probe.style.background);
		});
	});

	it('clears the industry selection when the same chip is clicked again', () => {
		const chip = button('.stats__chips--industries button', 'Logistyka i transport');
		chip.click();
		chip.click();
		fixture.detectChanges();
		expect(el().querySelector('.stats__projects')).toBeNull();
	});

	it('maps a donut click to the industry selection', () => {
		fixture.componentInstance.selectIndustry('Edukacja i sport');
		expect(fixture.componentInstance.selectedProjects().length).toBe(3);
	});

	it('switches Lighthouse scores between the average and a single site', () => {
		const site = lighthouseReport.sites[0];
		button('.stats__chips--sites button', site.name).click();
		fixture.detectChanges();
		expect(fixture.componentInstance.scores().performance).toBe(site.performance);
		button('.stats__chips--sites button', 'Średnia').click();
		fixture.detectChanges();
		expect(fixture.componentInstance.selectedSite()).toBeNull();
	});

	it('shows how and when the scores were measured', () => {
		const caption = el().querySelector('.stats__caption')?.textContent ?? '';
		expect(caption).toContain(lighthouseReport.tool);
		expect(caption).toContain(lighthouseReport.measuredAt);
	});
});
