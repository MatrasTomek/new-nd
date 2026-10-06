import { Component, OnInit, computed, inject, input, output } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { echarts } from './echarts-core';
import { ND_DARK_THEME_NAME } from './nd-dark.theme';
import { MotionPreferenceService } from '../motion/motion-preference.service';

/** Część zdarzenia kliknięcia ECharts, z której korzystają strony. */
export interface ChartClickEvent {
	name: string;
	data: unknown;
	dataIndex: number;
}

@Component({
	selector: 'app-chart-card',
	standalone: true,
	imports: [NgxEchartsDirective],
	providers: [provideEchartsCore({ echarts })],
	template: `
		<section class="chart-card" [class.chart-card--bare]="variant() === 'bare'">
			@if (title()) {
				@switch (titleLevel()) {
					@case (2) {
						<h2 class="chart-card__title">{{ title() }}</h2>
					}
					@case (3) {
						<h3 class="chart-card__title">{{ title() }}</h3>
					}
					@default {
						<h4 class="chart-card__title">{{ title() }}</h4>
					}
				}
			}
			<div
				class="chart-card__chart"
				echarts
				role="img"
				[attr.aria-label]="ariaLabel() || title()"
				[options]="initialOptions"
				[merge]="effectiveOptions()"
				[theme]="theme"
				[autoResize]="true"
				[style.height.px]="height()"
				(chartClick)="chartClick.emit($event)"
			></div>
			<ng-content></ng-content>
		</section>
	`,
	styles: [
		`
			:host {
				display: block;
				min-width: 0;
			}
			.chart-card {
				height: 100%;
				padding: 1.25rem;
				background: rgba(255, 255, 255, 0.06);
				border: 1px solid rgba(255, 255, 255, 0.12);
				border-radius: 0.75rem;
				backdrop-filter: blur(16px);
				-webkit-backdrop-filter: blur(16px);
			}
			.chart-card--bare {
				padding: 0;
				background: none;
				border: 0;
				backdrop-filter: none;
				-webkit-backdrop-filter: none;
			}
			.chart-card__title {
				margin: 0 0 0.75rem;
				font-size: 1.1rem;
				font-family: 'Kumbh Sans', sans-serif;
				color: #f5f3ff;
			}
			.chart-card__chart {
				width: 100%;
			}
		`,
	],
})
export class ChartCardComponent implements OnInit {
	readonly options = input.required<EChartsCoreOption>();
	readonly title = input('');
	readonly ariaLabel = input('');
	readonly height = input(320);
	readonly titleLevel = input<2 | 3 | 4>(4);
	readonly variant = input<'card' | 'bare'>('card');
	readonly chartClick = output<ChartClickEvent>();

	readonly theme = ND_DARK_THEME_NAME;
	private readonly motion = inject(MotionPreferenceService);

	readonly effectiveOptions = computed<EChartsCoreOption>(() =>
		this.motion.reducedMotion() ? { ...this.options(), animation: false } : this.options(),
	);

	// ngx-echarts zastępuje cały stan wykresu przy zmianie [options] (setOption z notMerge),
	// więc pierwsze opcje idą przez [options], a kolejne przez [merge] — zoom, legenda i tooltip zostają.
	protected initialOptions: EChartsCoreOption | null = null;

	ngOnInit(): void {
		this.initialOptions = this.effectiveOptions();
	}
}
