import { mapGetters } from 'vuex'
import Chart from "../../components/Chart"
import DatePicker from "../../components/DatePicker"

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
        // TODO add delete, report etc.
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
