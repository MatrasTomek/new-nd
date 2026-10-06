import { Particle, createParticles, particleCount, stepParticles } from './particles';

const particle = (overrides: Partial<Particle>): Particle => ({
	x: 100,
	y: 100,
	vx: 0,
	vy: 0,
	baseVx: 0,
	baseVy: 0,
	radius: 1.5,
	...overrides,
});
const farAway = { x: -9999, y: -9999 };

describe('particles', () => {
	it('uses fewer particles on narrow screens', () => {
		expect(particleCount(375)).toBe(35);
		expect(particleCount(1280)).toBe(80);
	});

	it('creates particles inside the canvas', () => {
		const list = createParticles(50, 300, 200, Math.random);
		expect(list.length).toBe(50);
		list.forEach((p) => {
			expect(p.x).toBeGreaterThanOrEqual(0);
			expect(p.x).toBeLessThanOrEqual(300);
			expect(p.y).toBeGreaterThanOrEqual(0);
			expect(p.y).toBeLessThanOrEqual(200);
		});
	});

	it('pushes particles away from the pointer', () => {
		const p = particle({});
		stepParticles([p], 400, 400, { x: 90, y: 100 });
		expect(p.x).toBeGreaterThan(100);
	});

	it('bounces off the edges and stays inside', () => {
		const p = particle({ x: 1, vx: -3, baseVx: -0.3 });
		for (let i = 0; i < 10; i++) {
			stepParticles([p], 400, 400, farAway);
		}
		expect(p.x).toBeGreaterThanOrEqual(0);
		expect(p.vx).toBeGreaterThan(0);
	});

	it('relaxes back to its base velocity after being pushed', () => {
		const p = particle({ vx: 4, baseVx: 0.2 });
		for (let i = 0; i < 200; i++) {
			stepParticles([p], 100000, 100000, farAway);
		}
		expect(p.vx).toBeCloseTo(0.2, 1);
	});
});
