import { industries } from './industries';
import { projectsItems } from '../projects/project-content';
import { ND_CHART_PALETTE } from '../../../app/shared/charts/nd-dark.theme';

describe('industries', () => {
	const assigned = industries.flatMap((group) => group.projects.map((p) => p.id));

	it('assigns every portfolio project to an industry', () => {
		projectsItems.forEach((project) => expect(assigned).toContain(project.name));
	});

	it('lists each project only once', () => {
		expect(new Set(assigned).size).toBe(assigned.length);
	});

	it('has non-empty industries with human-readable labels', () => {
		industries.forEach((group) => {
			expect(group.projects.length).toBeGreaterThan(0);
			group.projects.forEach((p) => expect(p.label.length).toBeGreaterThan(0));
		});
	});

	it('gives every industry its own chart colour (no repeated hues in the donut)', () => {
		expect(industries.length).toBeLessThanOrEqual(ND_CHART_PALETTE.length);
	});
});
