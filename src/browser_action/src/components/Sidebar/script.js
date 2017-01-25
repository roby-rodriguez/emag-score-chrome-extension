import { mapGetters } from 'vuex'

export default {
    computed: mapGetters({
        products: 'products'
    }),
    methods: {
        select (p) {
            this.$store.dispatch('selectProduct', p)
                .then(() => this.$router.push('product'))
        }
    },
    created () {
        this.$store.dispatch('loadProducts')
    }
}
