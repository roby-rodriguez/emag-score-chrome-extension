import { load } from "../api"
import { StorageAPI } from "../../storage"
import { EmagTrackerAPI } from "../../backend"
import { resetChecker } from "../../tasks/checker"
import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT,
    UPDATE_CHART_BOUND, UPDATE_SETTINGS, LOAD_SETTINGS, RESET_SETTINGS, TOGGLE_LANGUAGE } from "./mutation-types"

export const loadProducts = ({ commit, state }) => {
    commit(LOAD_PRODUCTS_REQUEST)
    load(state.settings.general.onlineData, state.settings.notifications.allow)
        .then(products => {
            commit(LOAD_PRODUCTS_RESPONSE, products)
        })
        .catch(reason => {
            console.info(reason)
            commit(LOAD_PRODUCTS_RESPONSE, [])
        })
}

export const selectProduct = ({ commit, state }, product) => {
    if($.type(product) === "string") {
        const online = state.settings.general.onlineData
        const method = online ? EmagTrackerAPI.getProduct : StorageAPI.getLocal
        return method(product)
                    .then(found =>
                        commit(SELECT_PRODUCT, online ? found : found[product])
                    )
    } else
        commit(SELECT_PRODUCT, product)
}

export const updateBounds = ({ commit }, data) => {
    commit(UPDATE_CHART_BOUND, data)
}

export const updateSettings = ({ commit }, data) => {
    commit(UPDATE_SETTINGS, data)
}

export const saveSettings = ({ commit, state }) =>
    StorageAPI
        .getSync('settings')
        .then(data => {
            if (!$.isEmptyObject(data)) {
                var lang = data.settings.general.language
                if (data.settings.scan.timeout !== state.settings.scan.timeout)
                    resetChecker(state.settings)
            }
            if (lang !== state.settings.general.language)
                commit(TOGGLE_LANGUAGE, state.settings.general.language)
            StorageAPI.setSync({ settings: state.settings })
        })
        .catch(reason => StorageAPI.setSync({ settings: state.settings }))

export const loadSettings = ({ commit, dispatch }) =>
    StorageAPI
        .getSync('settings')
        .then(settings => {
            if (!$.isEmptyObject(settings)) {
                commit(LOAD_SETTINGS, settings)
            }
        })
        .catch(reason => {
            console.warn('Could not read user settings. ' + reason)
        })
        .then(() => dispatch('initI18n'))

export const resetSettings = ({ commit }) => {
    commit(RESET_SETTINGS)
    StorageAPI.removeSync('settings')
}

export const scanByDemand = ({ state }) =>
    StorageAPI
        .removeSync('lastCheck')
        .then(() => resetChecker(state.settings))

export const initI18n = ({ state }) =>
    i18next.init({
        initImmediate: false,
        lng: state.settings.general.language
    })
