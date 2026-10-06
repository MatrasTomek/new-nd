import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { MotionPreferenceService } from './motion-preference.service';
import { watchVisibility } from './in-view';
import { Particle, createParticles, drawParticles, particleCount, stepParticles } from './particles';

const OFFSCREEN = { x: -9999, y: -9999 };

@Component({
	selector: 'app-particle-field',
	standalone: true,
	template: `<canvas #canvas aria-hidden="true"></canvas>`,
	styles: [
		`
			:host {
				position: absolute;
				inset: 0;
				display: block;
				pointer-events: none;
				z-index: 0;
				mask-image: linear-gradient(to bottom, #000 70%, transparent);
			}
			canvas {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	],
})
export class ParticleFieldComponent implements AfterViewInit, OnDestroy {
	@ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

	private readonly host: HTMLElement = inject(ElementRef).nativeElement;
	private readonly motion = inject(MotionPreferenceService);
	private readonly zone = inject(NgZone);
	private ctx: CanvasRenderingContext2D | null = null;
	private particles: Particle[] = [];
	private pointer = OFFSCREEN;
	private width = 0;
	private height = 0;
	private frame = 0;
	private running = false;
	private visible = false;
	private readonly cleanups: Array<() => void> = [];

	ngAfterViewInit(): void {
		this.ctx = this.canvasRef.nativeElement.getContext('2d');
		if (!this.ctx) {
			return;
		}
		this.zone.runOutsideAngular(() => {
			this.resize();
			this.particles = createParticles(particleCount(this.width), this.width, this.height, Math.random);
			if (this.motion.reducedMotion()) {
				this.draw();
				return;
			}
			this.listen();
		});
	}

	ngOnDestroy(): void {
		this.running = false;
		cancelAnimationFrame(this.frame);
		this.cleanups.forEach((cleanup) => cleanup());
	}

	private listen(): void {
		const area = this.host.parentElement ?? this.host;
		const onMove = (event: PointerEvent) => {
			const rect = this.canvasRef.nativeElement.getBoundingClientRect();
			this.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
		};
		const onLeave = () => (this.pointer = OFFSCREEN);
		const onResize = () => this.resize();
		const onVisibilityChange = () => this.updateRunning();

		area.addEventListener('pointermove', onMove);
		area.addEventListener('pointerleave', onLeave);
		window.addEventListener('resize', onResize);
		document.addEventListener('visibilitychange', onVisibilityChange);
		const stopWatching = watchVisibility(this.host, (visible) => {
			this.visible = visible;
			this.updateRunning();
		});

		this.cleanups.push(
			() => area.removeEventListener('pointermove', onMove),
			() => area.removeEventListener('pointerleave', onLeave),
			() => window.removeEventListener('resize', onResize),
			() => document.removeEventListener('visibilitychange', onVisibilityChange),
			stopWatching,
		);
	}

	private updateRunning(): void {
		const shouldRun = this.visible && !document.hidden;
		if (shouldRun && !this.running) {
			this.running = true;
			this.frame = requestAnimationFrame(this.loop);
		} else if (!shouldRun && this.running) {
			this.running = false;
			cancelAnimationFrame(this.frame);
		}
	}

	private readonly loop = () => {
		if (!this.running) {
			return;
		}
		stepParticles(this.particles, this.width, this.height, this.pointer);
		this.draw();
		this.frame = requestAnimationFrame(this.loop);
	};

	private resize(): void {
		const canvas = this.canvasRef.nativeElement;
		const rect = canvas.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		this.width = rect.width;
		this.height = rect.height;
		canvas.width = Math.max(1, Math.round(rect.width * dpr));
		canvas.height = Math.max(1, Math.round(rect.height * dpr));
		this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	private draw(): void {
		if (this.ctx) {
			drawParticles(this.ctx, this.particles, this.width, this.height);
		}
	}
}
