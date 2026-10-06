import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartCardComponent } from '../../../shared/charts/chart-card.component';
import { CountUpDirective } from '../../../shared/motion/count-up.directive';
import { RevealDirective } from '../../../shared/motion/reveal.directive';
import { industries } from '../../../../assets/content/stats/industries';
import { lighthouseReport } from '../../../../assets/content/stats/lighthouse';
import { ND_CHART_OTHER, ND_CHART_PALETTE } from '../../../shared/charts/nd-dark.theme';
import { OTHER_INDUSTRY_LABEL, averageScores, industryChartOptions, lighthouseGaugeOptions } from './stats-chart-options';

@Component({
	selector: 'app-stats-section',
	standalone: true,
	imports: [ChartCardComponent, CountUpDirective, RevealDirective, RouterLink],
	templateUrl: './stats-section.component.html',
	styleUrls: ['./stats-section.component.scss'],
})
export class StatsSectionComponent {
	readonly industries = industries;
	readonly palette = ND_CHART_PALETTE;
	readonly otherColor = ND_CHART_OTHER;
	readonly otherLabel = OTHER_INDUSTRY_LABEL;
	readonly report = lighthouseReport;
	readonly projectCount = industries.reduce((sum, group) => sum + group.projects.length + 3, 0);
	// Projekty spoza wymienionych w industries.ts — pokazywane jako „Pozostałe”, żeby pierścień sumował się do licznika.
	readonly otherCount = this.projectCount - industries.reduce((sum, group) => sum + group.projects.length, 0);
	readonly average = averageScores(lighthouseReport.sites);

	readonly selectedIndustry = signal<string | null>(null);
	readonly selectedSite = signal<string | null>(null);

	readonly industryOptions = computed(() =>
		industryChartOptions(this.industries, this.selectedIndustry(), this.otherCount),
	);
	readonly selectedProjects = computed(() => this.industries.find((group) => group.name === this.selectedIndustry())?.projects ?? []);
	readonly scores = computed(() => {
		const name = this.selectedSite();
		return this.report.sites.find((site) => site.name === name) ?? this.average;
	});
	readonly gaugeOptions = computed(() => lighthouseGaugeOptions(this.scores()));

	onIndustryClick(name: string): void {
		if (name !== OTHER_INDUSTRY_LABEL) {
			this.selectIndustry(name);
		}
	}

	selectIndustry(name: string): void {
		this.selectedIndustry.update((current) => (current === name ? null : name));
	}

	selectSite(name: string | null): void {
		this.selectedSite.set(name);
	}
}

