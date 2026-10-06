import { AfterViewInit, Component, DestroyRef, ElementRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { filter, interval } from 'rxjs';
import { ChartCardComponent } from '../../../shared/charts/chart-card.component';
import { RevealDirective } from '../../../shared/motion/reveal.directive';
import { MotionPreferenceService } from '../../../shared/motion/motion-preference.service';
import { watchVisibility } from '../../../shared/motion/in-view';
import { mulberry32 } from '../../demo-page/demo-data';
import { TEASER_INTERVAL_MS, initialTeaserPoints, nextTeaserValue, teaserLineOptions } from './teaser-chart';

@Component({
	selector: 'app-demo-teaser',
	standalone: true,
	imports: [ChartCardComponent, RevealDirective, RouterLink],
	template: `
		<section class="teaser" appReveal aria-labelledby="teaser-title">
			<div class="teaser__text">
				<span class="teaser__eyebrow">Demo na żywo</span>
				<h3 id="teaser-title">Zobacz, jak wygląda aplikacja, którą możemy dla Ciebie zbudować</h3>
				<p>Interaktywny panel zamówień, faktur i magazynu — z filtrami, zoomem i danymi odświeżanymi na żywo.</p>
				<a class="teaser__cta" routerLink="/demo">Otwórz demo</a>
			</div>
			<app-chart-card
				class="teaser__chart"
				title="Zamówienia na żywo"
				ariaLabel="Wykres liniowy przykładowych zamówień aktualizowany na żywo"
				[options]="options()"
				[height]="220"
			></app-chart-card>
		</section>
	`,
	styles: [
		`
			.teaser {
				display: grid;
				grid-template-columns: minmax(0, 1fr);
				gap: 1.5rem;
				align-items: center;
				padding: 1.5rem;
				border-radius: 0.75rem;
				border: 1px solid rgba(255, 255, 255, 0.12);
				background:
					radial-gradient(circle at 0% 0%, rgba(139, 123, 255, 0.25), transparent 55%),
					rgba(255, 255, 255, 0.04);
			}
			.teaser__eyebrow {
				font-family: 'Fira', monospace;
				font-size: 0.8rem;
				letter-spacing: 2px;
				text-transform: uppercase;
				color: #ff6fc9;
			}
			h3 {
				margin: 0.5rem 0;
				font-family: 'Kumbh Sans', sans-serif;
				color: #f5f3ff;
			}
			p {
				color: #cdc6ec;
			}
			.teaser__cta {
				display: inline-flex;
				align-items: center;
				min-height: 44px;
				margin-top: 1rem;
				padding: 0.6rem 1.5rem;
				border-radius: 999px;
				background: linear-gradient(90deg, #8b7bff, #ff6fc9);
				color: #0a0618;
				font-weight: 700;
			}
			@media (min-width: 1020px) {
				.teaser {
					grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
				}
			}
		`,
	],
})
export class DemoTeaserComponent implements AfterViewInit {
	readonly points = signal(initialTeaserPoints(mulberry32(7)));
	readonly options = computed(() => teaserLineOptions(this.points()));

	private readonly host: HTMLElement = inject(ElementRef).nativeElement;
	private readonly motion = inject(MotionPreferenceService);
	private readonly destroyRef = inject(DestroyRef);
	private visible = false;

	ngAfterViewInit(): void {
		if (this.motion.reducedMotion()) {
			return;
		}
		const stopWatching = watchVisibility(this.host, (visible) => (this.visible = visible));
		this.destroyRef.onDestroy(stopWatching);
		interval(TEASER_INTERVAL_MS)
			.pipe(
				filter(() => this.visible && !document.hidden),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe(() =>
				this.points.update((points) => [...points.slice(1), nextTeaserValue(points[points.length - 1], Math.random)]),
			);
	}
}
