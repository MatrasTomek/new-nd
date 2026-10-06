export interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	baseVx: number;
	baseVy: number;
	radius: number;
}

const LINK_DISTANCE = 120;
const REPEL_RADIUS = 120;
const REPEL_FORCE = 0.6;
const RELAX = 0.04;
const DOT_COLOR = 'rgba(205, 198, 236, 0.75)';
const LINK_RGB = '139, 123, 255';

export function particleCount(width: number): number {
	return width < 640 ? 35 : 80;
}

export function createParticles(count: number, width: number, height: number, rand: () => number): Particle[] {
	return Array.from({ length: count }, () => {
		const baseVx = (rand() - 0.5) * 0.5;
		const baseVy = (rand() - 0.5) * 0.5;
		return {
			x: rand() * width,
			y: rand() * height,
			vx: baseVx,
			vy: baseVy,
			baseVx,
			baseVy,
			radius: 1 + rand() * 1.5,
		};
	});
}

export function stepParticles(
	particles: Particle[],
	width: number,
	height: number,
	pointer: { x: number; y: number },
): void {
	for (const p of particles) {
		const dx = p.x - pointer.x;
		const dy = p.y - pointer.y;
		const distance = Math.hypot(dx, dy);
		if (distance > 0 && distance < REPEL_RADIUS) {
			const force = (1 - distance / REPEL_RADIUS) * REPEL_FORCE;
			p.vx += (dx / distance) * force;
			p.vy += (dy / distance) * force;
		}
		p.vx += (p.baseVx - p.vx) * RELAX;
		p.vy += (p.baseVy - p.vy) * RELAX;
		p.x += p.vx;
		p.y += p.vy;

		if (p.x < 0 || p.x > width) {
			p.x = Math.min(width, Math.max(0, p.x));
			const direction = p.x === 0 ? 1 : -1;
			p.vx = direction * Math.abs(p.vx);
			p.baseVx = direction * Math.abs(p.baseVx);
		}
		if (p.y < 0 || p.y > height) {
			p.y = Math.min(height, Math.max(0, p.y));
			const direction = p.y === 0 ? 1 : -1;
			p.vy = direction * Math.abs(p.vy);
			p.baseVy = direction * Math.abs(p.baseVy);
		}
	}
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], width: number, height: number): void {
	ctx.clearRect(0, 0, width, height);
	for (let i = 0; i < particles.length; i++) {
		for (let j = i + 1; j < particles.length; j++) {
			const a = particles[i];
			const b = particles[j];
			const distance = Math.hypot(a.x - b.x, a.y - b.y);
			if (distance < LINK_DISTANCE) {
				ctx.strokeStyle = `rgba(${LINK_RGB}, ${(1 - distance / LINK_DISTANCE) * 0.35})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();
			}
		}
	}
	ctx.fillStyle = DOT_COLOR;
	for (const p of particles) {
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
		ctx.fill();
	}
}
