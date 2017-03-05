import { mapGetters } from 'vuex'
import { i18n } from "../../mixin"
import messages from "./messages"

const renderGraph = (elem, data, label) =>
    new Morris.Area({
        element: elem,
        data: data,
        xkey: 'dateRecorded',
        ykeys: ['price'],
        labels: [ label ],
        xLabels: 'day',
        parseTime: false,
        pointSize: 2,
        hideHover: 'auto',
        fillOpacity: 0.5,
        resize: true
    })

export default {
    mixins: [ i18n(messages) ],
    computed: mapGetters({
        data: 'chartData'
    }),
    mounted() {
        this.graph = renderGraph(this.$el, this.data, this.i18n('price'))
    },
    updated() {
        this.graph.setData(this.data)
    }
}
