import { mapGetters } from 'vuex'
import Chart from "../../components/Chart"

export default {
    computed: mapGetters({
        selected: 'selected'
    }),
    components: {
        'emag-chart': Chart
    },
    methods: {
        // TODO add delete, report etc.
    },
    mounted () {
    },
    updated () {
    }
}
