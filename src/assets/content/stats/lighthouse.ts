export interface LighthouseScores {
	performance: number;
	accessibility: number;
	bestPractices: number;
	seo: number;
}

export interface LighthouseSite extends LighthouseScores {
	name: string;
	url: string;
}

export interface LighthouseReport {
	tool: string;
	measuredAt: string;
	strategy: 'mobile';
	sites: LighthouseSite[];
}

// Wygenerowane przez scripts/measure-lighthouse.mjs (mediana z 3 przebiegów). Aktualizacja: uruchom skrypt ponownie.
export const lighthouseReport: LighthouseReport = {
	tool: 'Lighthouse 13',
	measuredAt: 'październik 2026',
	strategy: 'mobile',
	sites: [
		{ name: 'Stowarzyszenie Olimpijczyk', url: 'https://www.olimpijczyk-proszowki.pl/', performance: 54, accessibility: 94, bestPractices: 96, seo: 92 },
		{ name: 'Przedszkole Mokrzyska', url: 'https://www.przedszkolemokrzyska.pl/', performance: 67, accessibility: 84, bestPractices: 100, seo: 100 },
		{ name: 'Mawex', url: 'https://www.mawex-biuro.pl/', performance: 69, accessibility: 77, bestPractices: 96, seo: 100 },
		{ name: 'OMEGA Dulowski', url: 'https://omega-dulowski.ovh/', performance: 79, accessibility: 91, bestPractices: 92, seo: 100 },
		{ name: 'Parafia Mokrzyska', url: 'https://parafiamokrzyska.pl/', performance: 78, accessibility: 78, bestPractices: 100, seo: 100 },
		{ name: 'Twoja Logistyka', url: 'https://www.twojalogistyka.com.pl/', performance: 56, accessibility: 79, bestPractices: 96, seo: 91 },
		{ name: 'PostAI', url: 'https://www.developerweb.pl/', performance: 100, accessibility: 95, bestPractices: 100, seo: 90 },
		{ name: 'Zawody sportowe', url: 'https://www.zawody.developerweb.pl/#/', performance: 92, accessibility: 91, bestPractices: 100, seo: 91 },
	],
};
