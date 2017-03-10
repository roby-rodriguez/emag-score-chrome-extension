import { load } from "../api"
import { StorageAPI } from "../../storage"
import { MessagingAPI } from "../../messaging"
import { EmagTrackerAPI } from "../../backend"
import defaultSettings from "../../utils/settings/defaultValues"
import { RESET_CHECKER, CHANGE_LANGUAGE } from "../../messaging/messageType"
import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT,
    UPDATE_CHART_BOUND, UPDATE_SETTINGS, LOAD_SETTINGS } from "./mutationType"

export const loadProducts = ({ commit, state }) => {
    commit(LOAD_PRODUCTS_REQUEST)
    load(state.settings.actual.general.onlineData, state.settings.actual.notifications.allow)
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
        const online = state.settings.actual.general.onlineData
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
        .setSync({ settings: state.settings.current })
        .then(() => {
            if (state.settings.actual.scan.timeout !== state.settings.current.scan.timeout)
                MessagingAPI.send({
                    type: RESET_CHECKER,
                    value: state.settings.current
                })
            if (state.settings.actual.general.language !== state.settings.current.general.language)
                MessagingAPI.send({
                    type: CHANGE_LANGUAGE,
                    value: state.settings.current.general.language
                })
            commit(LOAD_SETTINGS, state.settings.current)
        })
        // TODO must show this to user
        //.catch(reason => console.warn('Could not save user settings. ' + reason))
/*
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
*/

export const loadSettings = ({ commit, dispatch }) =>
    StorageAPI
        .getSync('settings')
        .then(data => {
            const values = $.isEmptyObject(data) ? defaultSettings : data.settings
            commit(LOAD_SETTINGS, values)
        })
        .catch(reason => {
            console.warn('Could not read user settings. ' + reason)
            commit(LOAD_SETTINGS, defaultSettings)
        })
        .then(() => dispatch('initI18n'))

export const resetSettings = ({ commit }) => {
    commit(LOAD_SETTINGS, defaultSettings)
    StorageAPI.removeSync('settings')
}

export const scanByDemand = ({ state }) =>
    StorageAPI
        .removeSync('lastCheck')
        .then(() =>
            MessagingAPI.send({
                type: RESET_CHECKER,
                value: state.settings.actual
            })
        )

export const initI18n = ({ state }) =>
    i18next.init({
        initImmediate: false,
        lng: state.settings.actual.general.language
    })
