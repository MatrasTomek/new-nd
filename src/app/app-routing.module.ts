import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { OfferPageComponent } from './pages/offer-page/offer-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { ContactPagesComponent } from './pages/contact-pages/contact-pages.component';



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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
