export const ND_DARK_THEME_NAME = 'nd-dark';

// Paleta kategoryczna zwalidowana skillem dataviz (validate_palette.js, tryb dark, tło #120a2e): wszystkie testy PASS.
export const ND_CHART_PALETTE: readonly string[] = [
	'#8b7bff',
	'#e0479e',
	'#4a8fe0',
	'#c08419',
	'#169c8c',
	'#c46a3a',
	'#b05cc9',
	'#6f9a2a',
];
// Kolory statusów — zarezerwowane, nigdy nie używane jako kolejna seria.
export const ND_STATUS = { good: '#0ca30c', warning: '#fab219', critical: '#d03b3b' } as const;
export const ND_CHART_ALERT = ND_STATUS.critical;
// Neutralny kolor kategorii zbiorczej „Pozostałe” (≥ 3:1 na tle karty, odróżnialny od sąsiednich serii).
export const ND_CHART_OTHER = '#6e6888';
export const ND_CHART_TEXT = '#cdc6ec';
export const ND_CHART_TEXT_STRONG = '#f5f3ff';

const AXIS_LINE = 'rgba(255, 255, 255, 0.12)';
const SPLIT_LINE = 'rgba(255, 255, 255, 0.06)';

const axis = {
	axisLine: { lineStyle: { color: AXIS_LINE } },
	axisTick: { show: false },
	axisLabel: { color: ND_CHART_TEXT },
	splitLine: { lineStyle: { color: SPLIT_LINE } },
	nameTextStyle: { color: ND_CHART_TEXT },
};

export const ND_DARK_THEME = {
	color: ND_CHART_PALETTE,
	backgroundColor: 'transparent',
	textStyle: { color: ND_CHART_TEXT, fontFamily: 'Roboto, sans-serif' },
	title: { textStyle: { color: ND_CHART_TEXT_STRONG } },
	legend: { textStyle: { color: ND_CHART_TEXT } },
	tooltip: {
		backgroundColor: '#120a2e',
		borderColor: AXIS_LINE,
		textStyle: { color: ND_CHART_TEXT_STRONG },
	},
	categoryAxis: { ...axis, splitLine: { show: false } },
	valueAxis: axis,
	dataZoom: {
		textStyle: { color: ND_CHART_TEXT },
		borderColor: AXIS_LINE,
		fillerColor: 'rgba(139, 123, 255, 0.2)',
		handleStyle: { color: '#8b7bff' },
	},
};
