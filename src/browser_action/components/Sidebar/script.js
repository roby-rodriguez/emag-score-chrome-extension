import { mapGetters } from 'vuex'
import { filterBy } from "../../util/filters"
import { i18n } from "../../mixin"
import SidebarMenu from "./SidebarMenu"
import messages from "./messages"

export default {
    mixins: [ i18n(messages) ],
    components: {
        SidebarMenu
    },
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
                .then(() => this.$router.push('/product?pid=' + p.pid))
        },
        filterBy
    },
    created () {
        this.$store.dispatch('loadProducts')
    }
}
