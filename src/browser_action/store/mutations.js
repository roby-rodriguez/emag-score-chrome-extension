import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT,
    UPDATE_CHART_BOUND, UPDATE_SETTINGS, LOAD_SETTINGS, RESET_SETTINGS, TOGGLE_LANGUAGE } from "./mutation-types"
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
        state.settings[data.component][data.property] = data.value
    },

    [RESET_SETTINGS] (state) {
        state.settings = defaultSettings
    },

    [LOAD_SETTINGS] (state, data) {
        state.currentLang = data.settings.general.language
        state.settings = data.settings
    },

    [TOGGLE_LANGUAGE] (state, lang) {
        state.currentLang = lang
    }
}
