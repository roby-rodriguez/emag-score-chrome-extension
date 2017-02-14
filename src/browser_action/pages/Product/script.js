import { mapGetters } from 'vuex'
import datetimepicker from 'datepicker'
import Chart from "../../components/Chart"

const _reset = picker => {
    picker.datetimepicker("minDate", false)
    picker.datetimepicker("maxDate", false)
}

const _set = (picker, from, until, selected) => {
    if (from == selected)
        picker.datetimepicker("useCurrent", true)
    picker.datetimepicker("defaultDate", selected)
    picker.datetimepicker("minDate", from)
    picker.datetimepicker("maxDate", until)
}

export default {
    data() {
        console.log("data() called")
        return {
            update: false
        }
    },
    computed: mapGetters({
        selected: 'selected',
        bounds: 'chartBounds'
    }),
    components: {
        'emag-chart': Chart
    },
    methods: {
        // TODO add delete, report etc.
    },
    mounted () {
        this.$from = $('#from')
        this.$until = $('#until')
        this.$from.datetimepicker({
            format: "DD-MM-YYYY"
        }).on("dp.change",  e => {
            if (e.date > this.bounds.selectedUntil) {
                // reset
                this.$from.datetimepicker("date", e.oldDate)
            } else {
                this.update = !this.update
                this.$store.dispatch("updateBounds", {
                    type: "selectedFrom",
                    date: e.date
                })
            }
            console.log(e)
        })
        this.$until.datetimepicker({
            format: "DD-MM-YYYY"
        }).on("dp.change",  e => {
            if (e.date < this.bounds.selectedFrom) {
                // reset
                this.$until.datetimepicker("date", e.oldDate)
            } else {
                this.update = !this.update
                this.$store.dispatch("updateBounds", {
                    type: "selectedUntil",
                    date: e.date
                })
            }
            console.log(e)
        })
        _reset(this.$from)
        _reset(this.$until)
        _set(this.$from, this.bounds.from, this.bounds.until, this.bounds.selectedFrom)
        _set(this.$until, this.bounds.from, this.bounds.until, this.bounds.selectedUntil)
    },
    updated () {
        console.log("updated")
        _reset(this.$from)
        _reset(this.$until)
        _set(this.$from, this.bounds.from, this.bounds.until, this.bounds.selectedFrom)
        _set(this.$until, this.bounds.from, this.bounds.until, this.bounds.selectedUntil)
    }
}
