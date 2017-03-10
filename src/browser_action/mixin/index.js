import { mapGetters } from 'vuex'
import { I18N } from "../../utils/i18n"

const i18n = (messages, namespace='i18n.namespace' + Date.now()) => ({
    computed: mapGetters([ 'lang' ]),
    created() {
        //i18next.addResourceBundle(this.lang, namespace, messages[this.lang], true)
        I18N.load(messages, namespace)
    },
    methods: {
        i18n(key, ns=namespace, vars={}) {
            //return i18next.t(key, { lng: this.lang, ns: ns, replace: vars })
            return I18N.translate(key, ns, vars)
        }
    },
    watch: {
        lang() {
            //i18next.addResourceBundle(this.lang, namespace, messages[this.lang], true)
            I18N.load(messages, namespace)
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
