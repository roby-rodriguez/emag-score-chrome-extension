import datetimepicker from 'datepicker'

export default {
    props: [ 'title', 'bounds', 'property', 'locale' ],
    mounted () {
        this.$datepicker = $(this.$el)
        this.$datepicker.datetimepicker({
            locale: this.locale,
            useCurrent: false,
            format: "DD-MM-YYYY",
            minDate: this.bounds.from,
            maxDate: this.bounds.until,
            defaultDate: this.bounds[this.property]
        }).on("dp.hide",  e => {
            this.$emit('datepicker-selected', e.date)
        })
    },
    watch: {
        bounds() {
            this.$datepicker.datetimepicker("minDate", false)
            this.$datepicker.datetimepicker("maxDate", false)
            this.$datepicker.datetimepicker("minDate", this.bounds.from)
            this.$datepicker.datetimepicker("maxDate", this.bounds.until)
            this.$datepicker.datetimepicker("date", this.bounds[this.property])
        }
    }
}
