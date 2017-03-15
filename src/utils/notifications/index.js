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

const _variationKeyword = priceVariation => {
    switch (priceVariation) {
        case PRICE_DECREASE:
            return 'cheaper'
        case PRICE_INCREASE:
            return 'more expensive'
    }
}
// TODO see i18n
const priceChangedText = (pid, pTitle, variation, variationType) =>
    'Tracked product (product id: ' + pid + ') ' + pTitle + ' is now '+ variation + '% ' + _variationKeyword(variationType) + '!'

export { bagdeBackgroundColor, priceChangedText }
