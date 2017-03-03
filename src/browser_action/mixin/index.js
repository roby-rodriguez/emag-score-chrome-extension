const i18n = messages => ({
    created() {
        const lang = this.$store.state.settings.general.language
        i18next.addResourceBundle(lang, 'translation', messages[lang], true)
    },
    methods: {
        i18n(key) {
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
