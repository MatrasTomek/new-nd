import { Component } from '@angular/core';

@Component({
	selector: 'app-offer-page',
	templateUrl: './offer-page.component.html',
	styleUrls: ['./offer-page.component.scss'],
	standalone: false,
})
export class OfferPageComponent {
	wrapperOpen1: boolean = false;
	wrapperOpen2: boolean = false;

	toggleWrapper1() {
		this.wrapperOpen1 = !this.wrapperOpen1;
	}
	toggleWrapper2() {
		this.wrapperOpen2 = !this.wrapperOpen2;
	}
}
