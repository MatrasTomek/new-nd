import { ND_CHART_ALERT, ND_CHART_PALETTE, ND_DARK_THEME, ND_DARK_THEME_NAME } from './nd-dark.theme';

describe('nd-dark theme', () => {
	it('defines an eight-colour categorical palette of distinct hex colours', () => {
		expect(ND_CHART_PALETTE.length).toBe(8);
		ND_CHART_PALETTE.forEach((color) => expect(color).toMatch(/^#[0-9a-f]{6}$/i));
		expect(new Set(ND_CHART_PALETTE).size).toBe(8);
	});

	it('uses the palette, a transparent background and a distinct alert colour', () => {
		const theme = ND_DARK_THEME as { color: readonly string[]; backgroundColor: string };
		expect(theme.color).toEqual(ND_CHART_PALETTE);
		expect(theme.backgroundColor).toBe('transparent');
		expect(ND_CHART_ALERT).toMatch(/^#[0-9a-f]{6}$/i);
		expect(ND_DARK_THEME_NAME).toBe('nd-dark');
	});
});
