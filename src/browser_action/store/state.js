import { getSettings } from "../../utils/settings"

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
    settings: null,// oare pot face un extends direct aici getSettings(),
    //currentLang: null,
}
