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
		],
	},
	{
		name: 'Organizacje i parafie',
		projects: [{ id: 'Parish', label: 'Parafia Mokrzyska' }],
	},
	{
		name: 'Aplikacje biznesowe',
		projects: [
			{ id: 'Orders', label: 'System zamówień' },
			{ id: 'Invoices', label: 'System faktur' },
			{ id: 'Wareh', label: 'System magazynowy' },
			{ id: 'Charts', label: 'Panel raportowy' },
		],
	},
	{
		name: 'Własne produkty i AI',
		projects: [
			{ id: 'PostAI', label: 'PostAI' },
			{ id: 'OldNd', label: 'Poprzednia strona ND' },
		],
	},
];
