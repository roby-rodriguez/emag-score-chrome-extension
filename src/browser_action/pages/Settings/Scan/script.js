import { mapGetters } from 'vuex'
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
    computed: mapGetters({
        settings: 'settings'
    }),
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
            // TODO also should block button until scan finished
            this.$scanBtn.addClass('spinner')
            this.$store.dispatch('scanByDemand')
                .then(() => this.$scanBtn.removeClass('spinner'))
                .catch(error => {
                    this.$scanBtn.removeClass('spinner')
                    swal(this.i18n('error.title','swal'), this.i18n('error.message','swal', { error }), "error")
                })
        }
    }
}
