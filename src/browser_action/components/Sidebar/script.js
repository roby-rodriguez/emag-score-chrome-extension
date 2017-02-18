import { mapGetters } from 'vuex'
import { filterBy } from "../../util/filters"

export default {
    data() {
        return {
            search: ''
        }
    },
    computed: mapGetters({
        loading: 'loading',
        products: 'products'
    }),
    methods: {
        select (p) {
            this.$store.dispatch('selectProduct', p)
                .then(() => this.$router.push('product'))
        },
        filterBy
    },
    created () {
        this.$store.dispatch('loadProducts')
    }
}
