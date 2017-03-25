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
        settings: 'settings',
        scanning: 'scanning'
    }),
    components: {
        dropdown: DropDown
    },
    mounted() {
        this.$scanBtn = $('.glyphicon-refresh', $(this.$el))
        this.toggleScanBtn(this.scanning)
    },
    methods: {
        toggleScanBtn(on) {
            if (on)
                this.$scanBtn.addClass('spinner')
            else
                this.$scanBtn.removeClass('spinner')
            this.$scanBtn.parent().attr('disabled', on)
        },
        updateTimeout(value) {
            this.update('scan', 'timeout', value)
        },
        scan() {
            this.$store.dispatch('scanByDemand')
                .catch(error => swal(this.i18n('error.title','app'), this.i18n('error.message','app', { error }), "error"))
        }
    },
    watch: {
        scanning() {
            this.toggleScanBtn(this.scanning)
        }
    }
}
