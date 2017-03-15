import defaultSettings from "../../utils/settings/defaultValues"

export const state = {
    loading: false,
    scanning: false,
    products: [],
    selected: null,
    chart: {
        from: null,
        selectedFrom: null,
        until: null,
        selectedUntil: null
    },
    settings: {
        current: null,
        actual: null
    }
}
