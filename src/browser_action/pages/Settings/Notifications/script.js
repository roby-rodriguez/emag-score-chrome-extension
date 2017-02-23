import { mapGetters } from 'vuex'
import updateInput from "../../../mixin"
import { PRICE_DECREASE, PRICE_INCREASE } from "../../../../utils/product/priceChangeType"

export default {
    mixins: [ updateInput ],
    computed: {
        ...mapGetters(['settings']),
        priceVariation: {
            get: function () {
                return this.settings.notifications.priceVariation === PRICE_DECREASE
            },
            set: function (value) {
                this.update('notifications', 'priceVariation', value ? PRICE_DECREASE : PRICE_INCREASE)
            }
        }
    },
    methods: {
        updateAllow(value) {
            this.update('notifications', 'allow', value)
        }
    }
}
