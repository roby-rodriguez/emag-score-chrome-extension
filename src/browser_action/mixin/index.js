const i18n = messages => ({
    created() {
        // TODO only the resource bundle coresponding to current language should be selected
        i18next.addResourceBundle('en', 'translation', messages['en'], true, true)
        i18next.addResourceBundle('ro', 'translation', messages['ro'], true, true)
    },
    methods: {
        i18n(key) {
            // return Globalize(this.settings.general.language).formatMessage(key)
            return i18next.t(key)
        }
    }
})

const updateInput = {
    methods: {
        update(component, property, value) {
            this.$store.dispatch('updateSettings', {
                component: component,
                property: property,
                value: value
            })
        }
    }
}

export { i18n, updateInput }
