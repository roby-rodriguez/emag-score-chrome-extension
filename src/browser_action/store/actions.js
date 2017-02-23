import { load } from "../api"
import { StorageAPI } from "../../storage"
import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT,
    UPDATE_CHART_BOUND, UPDATE_SETTINGS, LOAD_SETTINGS, RESET_SETTINGS } from "./mutation-types"

export const loadProducts = ({ commit }) => {
    commit(LOAD_PRODUCTS_REQUEST)
    load()
        .then(products => {
            commit(LOAD_PRODUCTS_RESPONSE, products)
        })
        .catch(reason => {
            console.info(reason)
            commit(LOAD_PRODUCTS_RESPONSE, [])
        })
}

export const selectProduct = ({ commit }, product) => {
    commit(SELECT_PRODUCT, product)
}

export const updateBounds = ({ commit }, data) => {
    commit(UPDATE_CHART_BOUND, data)
}

export const updateSettings = ({ commit }, data) => {
    commit(UPDATE_SETTINGS, data)
}

export const saveSettings = ({ commit, state }) => {
    StorageAPI.setSync({
        settings: state.settings
    })
}

export const loadSettings = ({ commit }) => {
    StorageAPI
        .getSync('settings')
        .then(settings => {
            if (!$.isEmptyObject(settings))
                commit(LOAD_SETTINGS, settings)
        })
        .catch(reason => {
            console.warn('Could not read user settings. ' + reason)
        })
}

export const resetSettings = ({ commit }) => {
    commit(RESET_SETTINGS)
    StorageAPI.removeSync('settings')
}
