import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { TypewriterComponent } from '../../shared/motion/typewriter.component';
import { ParticleFieldComponent } from '../../shared/motion/particle-field.component';
import { StatsSectionComponent } from './stats-section/stats-section.component';
import { DemoTeaserComponent } from './demo-teaser/demo-teaser.component';

interface ProcessStep {
	label: string;
	description: string;
	icon: string;
}

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss'],
	standalone: true,
	imports: [NgFor, RouterLink, RevealDirective, TiltDirective, TypewriterComponent, ParticleFieldComponent, StatsSectionComponent, DemoTeaserComponent],
})
export class StartPageComponent {
	heroWords = ['strony internetowe', 'aplikacje webowe', 'dashboardy', 'systemy dla firm'];

	processSteps: ProcessStep[] = [
		{ label: 'Brief', description: 'Poznajemy Twój biznes, cele i odbiorców.', icon: 'pi pi-comments' },
		{ label: 'Projekt', description: 'Przygotowujemy koncepcję wizualną i zakres funkcjonalny.', icon: 'pi pi-pencil' },
		{ label: 'Realizacja', description: 'Wdrażamy i testujemy rozwiązanie etapami.', icon: 'pi pi-cog' },
		{ label: 'Wsparcie', description: 'Zapewniamy monitoring, aktualizacje i pomoc po starcie.', icon: 'pi pi-shield' },
	];

	testimonialPlaceholders = [
		{
			text: '„Profesjonalne podejście, szybka realizacja i strona, która działa bezbłędnie. W końcu mamy nowoczesną witrynę, którą łatwo aktualizować.”',
			author: 'Parafia Mokrzyska',
		},
		{
			text: '„Strona jest czytelna, szybka i świetnie wygląda na telefonie. Ma pełna edycję kontentu.Dokładnie to, czego potrzebował klub sportowy.”',
			author: 'Stowarzyszenie Olimpijczyk Proszówki',
		},
		{
			text: '„Pełen profesjonalizm. Serwis jest przejrzysty, nowoczesny i idealnie dopasowany do branży transportowej.”',
			author: 'Twoja Logistyka',
		},
		{
			text: '„Rodzice są zachwyceni! Strona jest kolorowa, intuicyjna i bardzo łatwa w obsłudze. Idealna dla przedszkola.”',
			author: 'Przedszkole Mokrzyska',
		},
		{
			text: '„W końcu mamy stronę, która wygląda jak nowoczesne biuro rachunkowe. Przejrzystość i funkcjonalność na najwyższym poziomie.”',
			author: 'Mawex',
		},
		{
			text: '„Realizacja szybka, estetyczna i dopracowana. Strona działa świetnie i dobrze prezentuje ofertę firmy.”',
			author: 'OMEGA Dulowski',
		},
	];
}

