import co from 'co'
import { StorageAPI } from "../../storage"
import { EmagTrackerAPI } from "../../backend"
import { today, getProductObject } from "../../utils"
import { PRICE_INCREASE, PRICE_DECREASE } from "./priceChangeType"

/**
 * Updates price history of product in local store
 *
 * @param pid local product id
 * @param price the new price
 */
const updatePrice = (pid, price) => {
    StorageAPI
        .getLocal(pid)
        .then(item => {
            const product = item[pid]
            if (product) {
                if (!product.history)
                    product.history = {}
                product.history[today()] = price
                StorageAPI
                    .setLocal(getProductObject(product))
                    .catch(reason => {
                        console.warn("Could not update price in local store: " + this.pid)
                        console.warn(reason)
                    })
            }
        })
}

/**
 * Performs the following for each product:
 *
 * > add product to local store
 * > track product remotely
 * > add PID to sync store
 * > show sync store usage
 *
 * @param products
 */
const track = products => {
    return co(function *() {
        let bytesInUse, productProblems
        const problems = [], pids = [], now = today()
        for (const product of products) {
            productProblems = []
            try {
                const local = yield StorageAPI.getLocal(product.pid)
                if ($.isEmptyObject(local)) {
                    product.history = { [now]: product.price }
                    StorageAPI.setLocal(getProductObject(product))
                }
            } catch (e) {
                problems.push(new Error("Could not save product to local store: " + product.pid))
            }
            try {
                yield EmagTrackerAPI.addProduct(product)
            } catch (e) {
                problems.push(new Error("Could not push product to remote: " + product.pid))
            }
            try {
                yield StorageAPI.setSync(getProductObject(product, true))
            } catch (e) {
                problems.push(new Error("Could not save product to sync store: " + product.pid))
            }

            if (productProblems.length)
                problems.concat(productProblems)
            else
                pids.push(product.pid)
        }
        try {
            bytesInUse = yield StorageAPI.getUsage()
        } catch (e) {
            console.warn("Could not get sync store usage: " + e)
        }
        return {
            bytesInUse,
            problems,
            pids
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
        if (changeType === PRICE_INCREASE && newPrice > oldPrice)
            return _percentage(newPrice, oldPrice)
        else if (changeType === PRICE_DECREASE && newPrice < oldPrice)
            return _percentage(oldPrice, newPrice)
    }
}

export { track, updatePrice, checkPriceChange }
