import { mapGetters } from 'vuex'
import { updateInput, i18n } from "../../../mixin"
import DropDown from "../../../components/DropDown"
import Toggle from "../../../components/Toggle"
import messages from "./messages"
import defaultLanguages from "../../../../utils/settings/defaultLanguageValues"

export default {
    mixins: [ updateInput, i18n(messages) ],
    props: {
        languages: {
            type: Array,
            default() {
                return defaultLanguages
            }
        }
    },
    computed: mapGetters({
        settings: 'settings'
    }),
    components: {
        dropdown: DropDown,
        toggle: Toggle
    },
    methods: {
        updateLanguage(value) {
            this.update('general', 'language', value)
        },
        updateOnlineData(value) {
            this.update('general', 'onlineData', value)
        },
        updateCaching(value) {
            this.update('general', 'caching', value)
        }
    }
}
