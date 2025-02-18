import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss'],
	standalone: false,
})
export class StartPageComponent implements AfterViewInit, OnDestroy {
	private intervalId: any;

	ngAfterViewInit() {
		this.intervalId = setInterval(this.shineRandomImage, 3000);
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
}
