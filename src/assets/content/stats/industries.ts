export interface IndustryProject {
	/** Odpowiada `ProjectItem.name` w project-content.ts */
	id: string;
	label: string;
}

export interface IndustryGroup {
	name: string;
	projects: IndustryProject[];
}

export const industries: IndustryGroup[] = [
	{
		name: 'Edukacja i sport',
		projects: [
			{ id: 'Olimpijczyk', label: 'Stowarzyszenie Olimpijczyk Proszówki' },
			{ id: 'Kinder', label: 'Przedszkole Mokrzyska' },
			{ id: 'Zawody', label: 'Zawody sportowe' },
		],
	},
	{
		name: 'Usługi dla firm',
		projects: [
			{ id: 'Mawex', label: 'Mawex — biuro rachunkowe' },
			{ id: 'Marbud', label: 'Marbud' },
		],
	},
	{
		name: 'Logistyka i transport',
		projects: [
			{ id: 'Tlog', label: 'Twoja Logistyka' },
			{ id: 'Omega', label: 'OMEGA Dulowski' },
			{ id: 'TransLog', label: 'Transport i logistyka' },
			{ id: 'MexemTrans', label: 'Mexem' },
			{ id: 'MekTrans', label: 'MekTrans' },
			{ id: 'uaTrans', label: 'Ukrainian Transport UAB' },
		],
	},
	{
		name: 'Organizacje i parafie',
		projects: [
			{ id: 'Parish', label: 'Parafia Mokrzyska' },
			{ id: 'Parish2', label: 'Parafia Ryglice' },
		],
	},
	{
		name: 'Aplikacje biznesowe',
		projects: [
			{ id: 'Orders', label: 'System zamówień' },
			{ id: 'Invoices', label: 'System faktur' },
			{ id: 'Wareh', label: 'System magazynowy' },
			{ id: 'Charts', label: 'Panel raportowy' },
			{ id: 'OdresOnline', label: 'System sprzedaży online' },
			{ id: 'TSLM', label: 'System Zarządzania Zakupami transportowymi' },
		],
	},
	{
		name: 'Własne produkty i AI',
		projects: [
			{ id: 'PostAI', label: 'PostAI' },
			{ id: 'OldNd', label: 'Poprzednia strona ND' },
			{ id: 'shortLink', label: 'Short Link system' },
			{ id: 'jobscraper', label: 'Job Scraper' },
			{ id: 'web-offer-search', label: 'Web Offer Search' },
			{ id: 'transport-news-search', label: 'Transport News Search' },
			{ id: 'nd-soft-template', label: 'ND Soft Template' },
		],
	},
	{
		name: 'Szkoły językowe',
		projects: [
			{ id: 'EN4You', label: 'EN4You' },
			{ id: 'EasyLanguage', label: 'Easy language school' },
		],
	},
	{
		name: 'Blogi branżowe',
		projects: [
			{ id: 'Blog1', label: 'Praca dla kierowcy' },
			{ id: 'Blog2', label: 'Transport News' },
		],
	},
];

