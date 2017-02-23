import { mapGetters } from 'vuex'
import updateInput from "../../../mixin"
import DropDown from "../../../components/DropDown"
import defaultTimeouts from "../../../../utils/settings/defaultTimeoutValues"

export default {
    mixins: [ updateInput ],
    props: {
        timeouts: {
            type: Array,
            default() {
                return defaultTimeouts
            }
        }
    },
    computed: mapGetters({
        settings: 'settings'
    }),
    components: {
        dropdown: DropDown
    },
    methods: {
        updateTimeout(value) {
            this.update('scan', 'timeout', value)
        }
    }
}
