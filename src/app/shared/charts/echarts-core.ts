import * as echarts from 'echarts/core';
import { BarChart, GaugeChart, LineChart, PieChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ND_DARK_THEME, ND_DARK_THEME_NAME } from './nd-dark.theme';

echarts.use([
	BarChart,
	LineChart,
	PieChart,
	GaugeChart,
	GridComponent,
	TooltipComponent,
	LegendComponent,
	DataZoomComponent,
	CanvasRenderer,
]);
echarts.registerTheme(ND_DARK_THEME_NAME, ND_DARK_THEME);

export { echarts };
