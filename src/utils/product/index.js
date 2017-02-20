import moment from 'moment'
import { StorageAPI } from "../../storage"
import { PRICE_INCREASE, PRICE_DECREASE } from "./priceChangeType"

const updatePrice = (localProductPid, newPrice) => {
    StorageAPI
        .getLocal(localProductPid)
        .then(item => {
            const product = item[localProductPid]
            if (product) {
                const now = moment(new Date()).format('DD-MM-YYYY')
                if (!product.history)
                    product.history = {}
                product.history[now] = newPrice
                StorageAPI
                    .setLocal({
                        [localProductPid]: product
                    })
                    .catch(reason => {
                        console.warn("Could not update price in local store: " + this.pid)
                        console.warn(reason)
                    })
            }
        })
}

const _percentage = (a, b) =>
    parseInt(a/b*100%100)

const checkPriceChange = (product, price, changeType) => {
    const history = Object.keys(product.history).map(k => product.history[k])
    if (history.length) {
        const latestPrice = history.pop()
        const oldPrice = Number(latestPrice),
              newPrice = Number(price)
        if (changeType === PRICE_INCREASE)
            return newPrice > oldPrice ? _percentage(newPrice, oldPrice) : undefined
        else if (changeType === PRICE_DECREASE)
            return newPrice < oldPrice ? _percentage(oldPrice, newPrice) : undefined
    }
}

export { updatePrice, checkPriceChange }
