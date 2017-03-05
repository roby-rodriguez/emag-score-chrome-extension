import { mapGetters } from 'vuex'

const i18n = (messages, loadAll) => ({
    computed: mapGetters(['settings']),
    created() {
        this.ns = 'i18n.namespace' + Date.now()

        if (loadAll) {
            i18next.addResourceBundle('en', this.ns, messages['en'], true)
            i18next.addResourceBundle('ro', this.ns, messages['ro'], true)
        } else {
            const lang = this.$store.state.settings.general.language
            i18next.addResourceBundle(lang, this.ns, messages[lang], true)
        }
    },
    methods: {
        i18n(key) {
            return i18next.t(key, { lng: this.settings.general.language, ns: this.ns })
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
