import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT,
    UPDATE_CHART_BOUND, UPDATE_SETTINGS, LOAD_SETTINGS, SCAN_START, SCAN_END } from "./mutationType"
import { bounds } from "../util"
import defaultSettings from "../../utils/settings/defaultValues"

const initChart = history => {
    const { from, until } = bounds(history)
    return {
        from,
        selectedFrom: from,
        until,
        selectedUntil: until
    }
}

export default {

    [LOAD_PRODUCTS_REQUEST] (state) {
        state.loading = true
        state.products = []
        state.selected = null
    },

    [LOAD_PRODUCTS_RESPONSE] (state, products) {
        state.loading = false
        state.products = products
    },

    [SELECT_PRODUCT] (state, selected) {
        state.selected = selected
        state.chart = initChart(state.selected.history)
    },

    [UPDATE_CHART_BOUND] (state, data) {
        state.chart = Object.assign({}, state.chart, {
            [data.type]: data.date
        })
    },

    [UPDATE_SETTINGS] (state, data) {
        state.settings.current[data.component][data.property] = data.value
    },

    [LOAD_SETTINGS] (state, settings) {
        state.settings.current = $.extend(true, {}, settings)
        state.settings.actual = $.extend(true, {}, settings)
    },

    [SCAN_START] (state) {
        state.scanning = true
    },

    [SCAN_END] (state) {
        state.scanning = false
    }
}
