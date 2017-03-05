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
    settings: defaultSettings,
    currentLang: null
}
