import { mapGetters } from 'vuex'

const i18n = messages => ({
    computed: mapGetters([ 'lang' ]),
    created() {
        this.ns = 'i18n.namespace' + Date.now()

        i18next.addResourceBundle(this.lang, this.ns, messages[this.lang], true)
    },
    methods: {
        i18n(key) {
            return i18next.t(key, { lng: this.lang, ns: this.ns })
        }
    },
    watch: {
        lang() {
            i18next.addResourceBundle(this.lang, this.ns, messages[this.lang], true)
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
