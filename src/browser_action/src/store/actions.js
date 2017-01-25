import { load } from "../api"
import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT } from "./mutation-types"

export const loadProducts = ({ commit }) => {
    commit(LOAD_PRODUCTS_REQUEST)
    load()
        .then(products => {
            commit(LOAD_PRODUCTS_RESPONSE, products)
        })
        .catch(reason => {
            // TODO display this to the user
            console.log(JSON.stringify(reason))
        })
}

export const selectProduct = ({ commit }, product) => {
    commit(SELECT_PRODUCT, product)
}
