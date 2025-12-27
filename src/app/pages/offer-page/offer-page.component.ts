import { Component } from '@angular/core';

@Component({
	selector: 'app-offer-page',
	templateUrl: './offer-page.component.html',
	styleUrls: ['./offer-page.component.scss'],
	standalone: false,
})
export class OfferPageComponent {
	wrapperOpen: boolean = false;

	toggleWrapper() {
		this.wrapperOpen = !this.wrapperOpen;
	}
}
