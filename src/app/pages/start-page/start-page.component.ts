import { Component } from '@angular/core';

interface ProcessStep {
	label: string;
	description: string;
	icon: string;
}

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss'],
	standalone: false,
})
export class StartPageComponent {
	processSteps: ProcessStep[] = [
		{ label: 'Brief', description: 'Poznajemy Twój biznes, cele i odbiorców.', icon: 'pi pi-comments' },
		{ label: 'Projekt', description: 'Przygotowujemy koncepcję wizualną i zakres funkcjonalny.', icon: 'pi pi-pencil' },
		{ label: 'Realizacja', description: 'Wdrażamy i testujemy rozwiązanie etapami.', icon: 'pi pi-cog' },
		{ label: 'Wsparcie', description: 'Zapewniamy monitoring, aktualizacje i pomoc po starcie.', icon: 'pi pi-shield' },
	];

	testimonialPlaceholders = [1, 2];
}
