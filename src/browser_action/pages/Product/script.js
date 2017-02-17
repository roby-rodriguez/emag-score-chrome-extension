import { mapGetters } from 'vuex'
import Chart from "../../components/Chart"
import DatePicker from "../../components/DatePicker"
import { StorageAPI } from "../../../storage"

export default {
    computed: mapGetters({
        selected: 'selected',
        bounds: 'chartBounds'
    }),
    components: {
        'emag-chart': Chart,
        datepicker: DatePicker
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
                .catch(reason => {
                    swal("Oops...", "Something went wrong!\n\n" + reason, "error")
                })
        },
        report() {
            console.log("report")
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
