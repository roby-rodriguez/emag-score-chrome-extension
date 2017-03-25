import { load } from "../api"
import { StorageAPI } from "../../storage"
import { MessagingAPI } from "../../messaging"
import { EmagTrackerAPI } from "../../backend"
import { adapt } from "../../utils/settings"
import defaultSettings from "../../utils/settings/defaultValues"
import { RESET_CHECKER, TRIGGER_SCAN, CHANGE_LANGUAGE } from "../../messaging/messageType"
import { LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_RESPONSE, SELECT_PRODUCT,
    UPDATE_CHART_BOUND, UPDATE_SETTINGS, LOAD_SETTINGS, SCAN_START, SCAN_END } from "./mutationType"

export const loadProducts = ({ commit, state }, forcedUpdate) => {
    commit(LOAD_PRODUCTS_REQUEST)
    let settings = $.extend(true, {}, state.settings.actual)
    if (forcedUpdate)
        settings.general.caching = false
    load(adapt(settings))
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
                }).catch(reason => console.warn('Could not reset checker. ' + reason.message))
            if (state.settings.actual.general.language !== state.settings.current.general.language)
                MessagingAPI.send({
                    type: CHANGE_LANGUAGE,
                    value: state.settings.current.general.language
                }).catch(reason => console.warn('Could not change language. ' + reason.message))
            commit(LOAD_SETTINGS, state.settings.current)
        })

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

export const scanByDemand = ({ commit, state }) =>
    new Promise((resolve, reject) => {
        commit(SCAN_START)
        StorageAPI
            .removeSync('lastCheck')
            .then(() =>
                MessagingAPI.send({
                    type: TRIGGER_SCAN,
                    value: state.settings.actual
                })
                .then(() => {
                    commit(SCAN_END)
                    resolve()
                })
                .catch(reason => {
                    commit(SCAN_END)
                    reject(reason.message)
                })
            )
            .catch(reason => {
                commit(SCAN_END)
                reject('Could not remove last checked ' + reason)
            })
    })

export const initI18n = ({ state }) =>
    i18next.init({
        initImmediate: false,
        lng: state.settings.actual.general.language
    })
