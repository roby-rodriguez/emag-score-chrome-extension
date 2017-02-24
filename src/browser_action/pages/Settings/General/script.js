import { mapGetters } from 'vuex'
import updateInput from "../../../mixin"
import DropDown from "../../../components/DropDown"
import Toggle from "../../../components/Toggle"
import defaultLanguages from "../../../../utils/settings/defaultLanguageValues"

export default {
    mixins: [ updateInput ],
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
        }
    }
}
