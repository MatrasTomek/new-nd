import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartPageComponent } from './start-page/start-page.component';
import { OfferPageComponent } from './offer-page/offer-page.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { ContactPagesComponent } from './contact-pages/contact-pages.component';
import { RodoPageComponent } from './rodo-page/rodo-page.component';
import { CookiePageComponent } from './cookie-page/cookie-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		StartPageComponent,
		OfferPageComponent,
		ProjectsPageComponent,
		ContactPagesComponent,
		RodoPageComponent,
		CookiePageComponent,
	],
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class PagesModule {}
