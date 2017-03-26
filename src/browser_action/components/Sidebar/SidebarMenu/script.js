import { i18n } from "../../../mixin"
import { PRICE_INCREASE, PRICE_DECREASE } from "../../../../utils/product/priceChangeType"
import messages from "./messages"

const _getStyle = ({ changed, variation }) => {
    if (changed.length) {
        if (variation === PRICE_DECREASE)
            return "label-success"
        if (variation === PRICE_INCREASE)
            return "label-danger"
    }
    return "label-info"
}

export default {
    mixins: [ i18n(messages) ],
    props: {
        total: {
            default: null
        }
    },
    data() {
        return {
            trending: [],
            trendingStyle: 'label-info',
            trendingSelected: false
        }
    },
    created() {
        this.$store.dispatch('getTrending')
            .then(({ trending }) => {
                if (trending) {
                    this.trending = trending.changed
                    this.trendingStyle = _getStyle(trending)
                }
            })
    },
    methods: {
        trendingActive() {
            if (this.trendingSelected && this.trendingSelected !== "done")
                return "active"
        },
        trendingCount() {
            return this.trending.length || this.total
        },
        settings () {
            this.$router.push('/settings')
        },
        filter() {
            if (this.trendingSelected && this.trendingSelected !== "done") {
                // if already clicked once, reset
                this.trendingSelected = "done"
                this.$store.dispatch('loadProducts')
                this.trending = []
                this.trendingStyle = "label-info"
                this.$store.dispatch('resetTrending')
            } else if (this.trending.length && this.trendingSelected !== "done") {
                // toggle button and display trending products
                this.trendingSelected = true
                this.$store.dispatch('loadProducts', { pids: this.trending })
            }
        },
        refresh() {
            this.$store.dispatch('loadProducts', { forcedUpdate: true })
        }
    }
}
