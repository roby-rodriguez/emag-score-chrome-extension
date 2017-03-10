import { load } from "../api"
import { StorageAPI } from "../../storage"
import { EmagTrackerAPI } from "../../backend"
import { resetChecker } from "../../tasks/checker"
import { getSettings, setAsyncSettings, resetAsyncSettings } from "../../utils/settings"
import defaultSettings from "../../utils/settings/defaultValues"
import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT,
    UPDATE_CHART_BOUND, UPDATE_SETTINGS, LOAD_SETTINGS, RESET_SETTINGS, TOGGLE_LANGUAGE } from "./mutation-types"

export const loadProducts = ({ commit }) => {
    commit(LOAD_PRODUCTS_REQUEST)
    load(getSettings().general.onlineData, getSettings().notifications.allow)
        .then(products => {
            commit(LOAD_PRODUCTS_RESPONSE, products)
        })
        .catch(reason => {
            console.info(reason)
            commit(LOAD_PRODUCTS_RESPONSE, [])
        })
}

export const selectProduct = ({ commit }, product) => {
    if($.type(product) === "string") {
        const online = getSettings().general.onlineData
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
/*
    StorageAPI
        .getSync('settings')
        .then(data => {
            if (!$.isEmptyObject(data)) {
                var lang = data.settings.general.language
                if (data.settings.scan.timeout !== state.settings.scan.timeout)
                    resetChecker(state.settings.scan.timeout)
            }
            if (lang !== state.settings.general.language) {
                setLang(state.settings.general.language)
                commit(TOGGLE_LANGUAGE, state.settings.general.language)
            }
            StorageAPI.setSync({ settings: state.settings })
        })
        .catch(reason => StorageAPI.setSync({ settings: state.settings }))
*/
    setAsyncSettings(state.settings)
        .then(() => {
            if (state.currentLang !== state.settings.general.language) {
                commit(TOGGLE_LANGUAGE, state.settings.general.language)
            }
        })

export const loadSettings = ({ commit }) =>
    commit(LOAD_SETTINGS, getSettings())
/*
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
//        .then(() => dispatch('initI18n'))
*/

export const resetSettings = ({ commit }) => {
    //setLang(defaultSettings.general.language)
    //resetChecker(defaultSettings.scan.timeout)
    //commit(RESET_SETTINGS, defaultSettings)
    //StorageAPI.removeSync('settings')

    //TODO if everything works move this and similars back to Components
    resetAsyncSettings()
        .then(() => commit(RESET_SETTINGS, getSettings()))
}

export const scanByDemand = ({ state }) =>
    resetAsyncSettings('lastCheck')
/*
    StorageAPI
        .removeSync('lastCheck')
        .then(() => resetChecker(state.settings))
*/

/*export const initI18n = ({ state }) =>
    i18next.init({
        initImmediate: false,
        lng: state.settings.general.language
    })*/
