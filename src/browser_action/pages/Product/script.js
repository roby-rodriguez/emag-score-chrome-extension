import { mapGetters } from 'vuex'
import Chart from "../../components/Chart"
import DatePicker from "../../components/DatePicker"
import { StorageAPI } from "../../../storage"
import { i18n } from "../../mixin"
import messages from "./messages"

export default {
    mixins: [ i18n(messages) ],
    computed: mapGetters({
        selected: 'selected',
        bounds: 'chartBounds',
        loading: 'loading'
    }),
    components: {
        'emag-chart': Chart,
        datepicker: DatePicker
    },
    created() {
        if (!this.selected) {
            const pid = this.$route.query.pid
            if (pid)
                this.$store.dispatch('selectProduct', pid)
                    .catch(reason => this.$router.push('/'))
            else
                this.$router.push('/')
        }
    },
    methods: {
        remove() {
            StorageAPI
                .removeSync(this.selected.pid)
                .then(StorageAPI.removeLocal(this.selected.pid))
                .then(() => {
                    this.$router.push('/')
                    this.$store.dispatch('loadProducts')
                })
                .catch(error => swal(this.i18n('error.title','app'), this.i18n('error.message','app', { error }), "error"))
        },
        report() {
        },
        updateFrom(date) {
            this.$store.dispatch("updateBounds", {
                type: "selectedFrom",
                date: (date > this.bounds.selectedUntil) ? this.bounds.selectedUntil : date
            })
        },
        updateUntil(date) {
            this.$store.dispatch("updateBounds", {
                type: "selectedUntil",
                date: (date < this.bounds.selectedFrom) ? this.bounds.selectedFrom : date
            })
        }
    }
}
