import { getSettings, getLanguage } from "../../utils/settings"
import { adaptedChartData } from "../util"

export const getters = {
    loading: state => state.loading,
    products: state => state.products,
    selected: state => state.selected,
    chartBounds: state => state.chart,
    chartData: state => adaptedChartData(state.selected.history, state.chart.selectedFrom, state.chart.selectedUntil),
    settings: state => state.settings,
    lang: state => state.currentLang
}
