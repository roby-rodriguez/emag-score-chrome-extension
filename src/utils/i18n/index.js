import { getLanguage } from "../settings"
import messages from "./messages"

const _i18next = chrome.extension.getBackgroundPage().i18next

const I18N = {}

I18N.init = lang =>
    _i18next.init({
        initImmediate: false,
        resources: messages,
        lng: lang
    })
I18N.translate = (key, namespace="app", params={}) =>
    _i18next.t(key, { lng: getLanguage(), ns: namespace, replace: params })
I18N.load = (messages, namespace="app") =>
    _i18next.addResourceBundle(getLanguage(), namespace, messages[getLanguage()], true)

export { I18N }
