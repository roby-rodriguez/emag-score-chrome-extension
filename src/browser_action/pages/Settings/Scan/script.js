import { updateInput, i18n } from "../../../mixin"
import DropDown from "../../../components/DropDown"
import messages from "./messages"
import defaultTimeouts from "../../../../utils/settings/defaultTimeoutValues"

export default {
    mixins: [ updateInput, i18n(messages) ],
    props: {
        timeouts: {
            type: Array,
            default() {
                return defaultTimeouts
            }
        }
    },
    components: {
        dropdown: DropDown
    },
    mounted() {
        this.$scanBtn = $('.glyphicon-refresh', $(this.$el))
    },
    methods: {
        updateTimeout(value) {
            this.update('scan', 'timeout', value)
        },
        scan() {
            // TODO no callback available for this spinner - possible only by messaging
            // TODO also should block button until scan finished
            this.$scanBtn.addClass('spinner')
            this.$store.dispatch('scanByDemand')
                .catch(reason => swal("Oops...", "Something went wrong!\n\n" + reason, "error"))
        }
    }
}
