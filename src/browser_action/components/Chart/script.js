const adapt = data => Array.from(Object.keys(data), item => ({
        "dateRecorded": item,
        "price": data[item]
    })
)

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
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    computed: {
        history: function() {
            return adapt(this.data)
        }
    },
    mounted() {
        this.graph = renderGraph(this.$el, this.history)
    },
    updated() {
        this.graph.setData(this.history)
    }
}
