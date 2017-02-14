import moment from 'moment'
import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT, UPDATE_CHART_BOUND } from "./mutation-types"
import { bounds } from "../util"

const initChart = history => {
    const { first, last } = bounds(history),
        from = moment(first, "DD-MM-YYYY"),
        until = moment(last, "DD-MM-YYYY")
    return {
        from,
        selectedFrom: from,
        until,
        selectedUntil: until
    }
}

export default {

    [LOAD_PRODUCTS_REQUEST] (state) {
        state.products = []
        state.selected = null
    },

    [LOAD_PRODUCTS_RESPONSE] (state, products) {
        state.products = products
    },

    [SELECT_PRODUCT] (state, selected) {
        state.selected = selected
        state.chart = initChart(state.selected.history)
    },

    [UPDATE_CHART_BOUND] (state, data) {
        state.chart[data.type] = data.date
    }
}
