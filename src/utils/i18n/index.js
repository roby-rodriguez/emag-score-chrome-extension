import defaultSettings from "../settings/defaultValues"

const I18N = {}

I18N.init = (messages, lang = defaultSettings.general.language) =>
    i18next.init({
        resources: messages,
        ns: 'app',
        lng: lang
    })
I18N.translate = (key, namespace='app', params={}) =>
    i18next.t(key, { ns: namespace, replace: params })
I18N.load = (messages, lang, namespace) =>
    i18next.addResourceBundle(lang, namespace, messages[lang], true)
I18N.language = lang => {
    if (lang)
        i18next.changeLanguage(lang)
    return i18next.language
}

export { I18N }
