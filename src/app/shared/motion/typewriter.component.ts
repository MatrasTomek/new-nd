import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { MotionPreferenceService } from './motion-preference.service';

@Component({
	selector: 'app-typewriter',
	standalone: true,
	template: `<span class="visually-hidden">{{ words().join(', ') }}</span
		><span class="typewriter" aria-hidden="true">{{ text() }}<span class="typewriter__caret"></span></span>`,
	styles: [
		`
			/* Własna linia o stałej wysokości: pisanie i kasowanie nie zmienia wysokości nagłówka (brak CLS). */
			:host {
				display: block;
				min-height: 1.5em;
				min-height: 1lh;
			}
			.typewriter {
				background: linear-gradient(90deg, #8b7bff, #ff6fc9);
				-webkit-background-clip: text;
				background-clip: text;
				-webkit-text-fill-color: transparent;
				white-space: nowrap;
			}
			.typewriter__caret {
				display: inline-block;
				width: 2px;
				height: 1em;
				margin-left: 2px;
				vertical-align: -0.1em;
				background: #ff6fc9;
				animation: caret-blink 1s steps(1) infinite;
			}
			@keyframes caret-blink {
				50% {
					opacity: 0;
				}
			}
			@media (prefers-reduced-motion: reduce) {
				.typewriter__caret {
					animation: none;
				}
			}
		`,
	],
})
export class TypewriterComponent implements OnInit, OnDestroy {
	readonly words = input.required<string[]>();
	readonly typeDelay = input(70);
	readonly deleteDelay = input(35);
	readonly holdDelay = input(1800);
	readonly text = signal('');

	private readonly motion = inject(MotionPreferenceService);
	private timer: ReturnType<typeof setTimeout> | undefined;
	private wordIndex = 0;
	private chars = 0;
	private deleting = false;

	ngOnInit(): void {
		const words = this.words();
		if (!words.length) {
			return;
		}
		if (this.motion.reducedMotion()) {
			this.text.set(words[0]);
			return;
		}
		this.schedule(this.typeDelay());
	}

	ngOnDestroy(): void {
		clearTimeout(this.timer);
	}

	private step(): void {
		const word = this.words()[this.wordIndex];
		if (!this.deleting) {
			this.chars++;
			this.text.set(word.slice(0, this.chars));
			if (this.chars === word.length) {
				this.deleting = true;
				this.schedule(this.holdDelay());
				return;
			}
			this.schedule(this.typeDelay());
			return;
		}
		this.chars--;
		this.text.set(word.slice(0, this.chars));
		if (this.chars === 0) {
			this.deleting = false;
			this.wordIndex = (this.wordIndex + 1) % this.words().length;
		}
		this.schedule(this.deleteDelay());
	}

	private schedule(delay: number): void {
		this.timer = setTimeout(() => this.step(), delay);
	}
}
