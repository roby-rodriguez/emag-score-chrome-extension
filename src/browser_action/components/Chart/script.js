import { mapGetters } from 'vuex'

const renderGraph = (elem, data) =>
    new Morris.Area({
        element: elem,
        data: data,
        xkey: 'dateRecorded',
        ykeys: ['price'],
        labels: ['Price'],
        xLabels: 'day',
        parseTime: false,
        pointSize: 2,
        hideHover: 'auto',
        fillOpacity: 0.5,
        resize: true
    })

export default {
    computed: mapGetters({
        data: 'chartData'
    }),
    mounted() {
        this.graph = renderGraph(this.$el, this.data)
    },
    updated() {
        this.graph.setData(this.data)
    }
}
