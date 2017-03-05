import { updateInput, i18n } from "../../../mixin"
import DropDown from "../../../components/DropDown"
import Toggle from "../../../components/Toggle"
import messages from "./messages"
import defaultLanguages from "../../../../utils/settings/defaultLanguageValues"

export default {
    mixins: [ updateInput, i18n(messages, true) ],
    props: {
        languages: {
            type: Array,
            default() {
                return defaultLanguages
            }
        }
    },
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
