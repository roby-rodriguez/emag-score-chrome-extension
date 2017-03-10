import messages from "./messages"

const I18N = {}

I18N.init = lang =>
    i18next.init({
        initImmediate: false,
        resources: messages,
        lng: lang
    })
I18N.translate = (key, namespace, params) =>
    i18next.t(key, { ns: namespace, replace: params })
I18N.load = (messages, lang, namespace) =>
    i18next.addResourceBundle(lang, namespace, messages[lang], true)
I18N.language = lang =>
    i18next.changeLanguage(lang)

export { I18N }
