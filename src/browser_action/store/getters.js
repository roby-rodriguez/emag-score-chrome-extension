import { adaptedChartData } from "../util"

export const getters = {
    products: state => state.products,
    selected: state => state.selected,
    chartBounds: state => state.chart,
    chartData: state => adaptedChartData(state.selected.history, state.chart.selectedFrom, state.chart.selectedUntil)
}
