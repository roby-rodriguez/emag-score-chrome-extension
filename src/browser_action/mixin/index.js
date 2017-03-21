import { mapGetters } from 'vuex'
import { I18N } from "../../utils/i18n"

const i18n = (messages, namespace='i18n.namespace' + Date.now()) => ({
    computed: mapGetters([ 'lang' ]),
    created() {
        I18N.load(messages, this.lang, namespace)
    },
    methods: {
        i18n(key, ns=namespace, vars={}) {
            return I18N.translate(key, vars, ns, this.lang)
        }
    },
    watch: {
        lang() {
            I18N.load(messages, this.lang, namespace)
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
