import { industries } from './industries';
import { projectsItems } from '../projects/project-content';

describe('industries', () => {
	it('assigns every project exactly once and references no unknown projects', () => {
		const assigned = industries.flatMap((group) => group.projects.map((p) => p.id));
		const projectNames = projectsItems.map((p) => p.name);
		expect([...assigned].sort()).toEqual([...projectNames].sort());
		expect(new Set(assigned).size).toBe(assigned.length);
	});

	it('has six non-empty industries with human-readable labels', () => {
		expect(industries.length).toBe(6);
		industries.forEach((group) => {
			expect(group.projects.length).toBeGreaterThan(0);
			group.projects.forEach((p) => expect(p.label.length).toBeGreaterThan(0));
		});
	});
});
