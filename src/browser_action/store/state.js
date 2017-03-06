import defaultSettings from "../../utils/settings/defaultValues"

export const state = {
    loading: false,
    products: [],
    selected: null,
    chart: {
        from: null,
        selectedFrom: null,
        until: null,
        selectedUntil: null
    },
    settings: $.extend(true, {}, defaultSettings),
    currentLang: defaultSettings.general.language
}
