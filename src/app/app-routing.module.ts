import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { OfferPageComponent } from './pages/offer-page/offer-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { ContactPagesComponent } from './pages/contact-pages/contact-pages.component';
import { RodoPageComponent } from './pages/rodo-page/rodo-page.component';
import { CookiePageComponent } from './pages/cookie-page/cookie-page.component';

const routes: Routes = [
	{
		path: '',
		component: StartPageComponent,
	},
	{
		path: 'offer',
		component: OfferPageComponent,
	},
	{
		path: 'projects',
		component: ProjectsPageComponent,
	},
	{
		path: 'contact',
		component: ContactPagesComponent,
	},
	{
		path: 'rodo',
		component: RodoPageComponent,
	},
	{
		path: 'cookie',
		component: CookiePageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
