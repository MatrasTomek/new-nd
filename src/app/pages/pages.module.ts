import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartPageComponent } from './start-page/start-page.component';
import { OfferPageComponent } from './offer-page/offer-page.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { ContactPagesComponent } from './contact-pages/contact-pages.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [StartPageComponent, OfferPageComponent, ProjectsPageComponent, ContactPagesComponent],
	imports: [CommonModule, ReactiveFormsModule],
})
export class PagesModule {}
