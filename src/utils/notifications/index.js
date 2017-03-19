import { PRICE_DECREASE, PRICE_INCREASE } from "../product/priceChangeType"

const _GREEN = '#5FBA7D'
const _RED = '#C91D2E'

const bagdeBackgroundColor = priceVariation => {
    switch (priceVariation) {
        case PRICE_DECREASE:
            return _GREEN
        case PRICE_INCREASE:
            return _RED
    }
}

export { bagdeBackgroundColor }
