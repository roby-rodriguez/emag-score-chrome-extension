import { mapGetters } from 'vuex'
import updateInput from "../../../mixin"
import Toggle from "../../../components/Toggle"
import { PRICE_DECREASE, PRICE_INCREASE } from "../../../../utils/product/priceChangeType"

export default {
    mixins: [ updateInput ],
    components: {
        toggle: Toggle
    },
    computed: {
        ...mapGetters(['settings']),
        priceVariation: {
            get: function () {
                return this.settings.notifications.priceVariation === PRICE_DECREASE
            }
        }
    },
    methods: {
        updateAllow(value) {
            this.update('notifications', 'allow', value)
        },
        updatePriceVariation(value) {
            this.update('notifications', 'priceVariation', value ? PRICE_DECREASE : PRICE_INCREASE)
        }
    }
}
