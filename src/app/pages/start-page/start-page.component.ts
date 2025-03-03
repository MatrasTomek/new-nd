import { Component, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss'],
	standalone: false,
})
export class StartPageComponent implements AfterViewInit, OnDestroy {
	private intervalId: any;
	public floatedTitle$ = new BehaviorSubject<boolean>(false);
	public floatedSubTitle$ = new BehaviorSubject<boolean>(false);

	constructor(private renderer: Renderer2) {}

	ngAfterViewInit() {
		this.intervalId = setInterval(this.shineRandomImage, 3000);
		setTimeout(() => {
			this.playVideos();
		}, 500);

		setTimeout(() => {
			this.floatedTitle$.next(true);
		}, 1200);

		setTimeout(() => {
			this.floatedSubTitle$.next(true);
		}, 1500);
	}

	ngOnDestroy() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	shineRandomImage() {
		const images = document.querySelectorAll('.trust-image');
		if (images.length === 0) return;

		const randomIndex = Math.floor(Math.random() * images.length);
		const randomImage = images[randomIndex];

		randomImage.classList.add('shine-effect');

		setTimeout(() => {
			randomImage.classList.remove('shine-effect');
		}, 500);
	}

	playVideos() {
		const videos = document.querySelectorAll('video');
		videos.forEach((video, index) => {
			this.renderer.setProperty(video, 'muted', true);
			this.renderer.setProperty(video, 'autoplay', true);
			this.renderer.setProperty(video, 'loop', true);
			if (index === 1) {
				this.renderer.setProperty(video, 'playbackRate', 0.75);
			}
			video.play().catch((error) => {
				console.error('Video play failed:', error);
			});
		});
	}
}
