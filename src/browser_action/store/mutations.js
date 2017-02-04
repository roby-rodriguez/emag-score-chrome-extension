import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT } from "./mutation-types"

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
    }
}
