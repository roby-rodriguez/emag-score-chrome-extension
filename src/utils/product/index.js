import co from 'co'
import { StorageAPI } from "../../storage"
import { EmagTrackerAPI } from "../../backend"
import { today, getProductObject } from "../../utils"
import { PRICE_INCREASE, PRICE_DECREASE } from "./priceChangeType"

/**
 * Updates price history of product in local store. If online data is enabled, it replaces local product
 * with remote
 *
 * @param product current product
 * @param price the new price
 */
const updatePrice = (product, price) => {
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

/**
 * Performs the following for each product:
 *
 * > add product to local store
 * > track product remotely
 * > add PID to sync store
 * > show sync store usage
 *
 * @param products
 * @param onlineData
 */
const track = (products, onlineData) =>
    co(function *() {
        let bytesInUse, productProblems, remote = {}
        const problems = [], pids = [], now = today()
        for (let product of products) {
            productProblems = []

            try {
                remote = yield EmagTrackerAPI.getProduct(product.pid)
            } catch (e) {
                problems.push("Could not get product from remote: " + product.pid)
                console.warn(e)
            }
            if ($.isEmptyObject(remote)) {
                console.info("Product with pid: " + product.pid + " does not exist on remote, it will be added now.")
                try {
                    yield EmagTrackerAPI.addProduct(product)
                } catch (e) {
                    problems.push("Could not push product to remote: " + product.pid)
                    console.warn(e)
                }
            } else if (onlineData) {
                product = remote
                // update price history for remote if it hasn't been done already
                if (product.history && !product.history[now])
                    yield EmagTrackerAPI.updatePrice(product.pid, product.price)
            }

            if (!product.history)
                product.history = {}
            product.history[now] = product.price

            try {
                StorageAPI.setLocal(getProductObject(product))
            } catch (e) {
                problems.push("Could not save product to local store: " + product.pid)
                console.warn(e)
            }

            try {
                yield StorageAPI.setSync(getProductObject(product, true))
            } catch (e) {
                problems.push("Could not save product to sync store: " + product.pid)
                console.warn(e)
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

const _percentage = (a, b) =>
    parseInt(a/b*100%100)

const checkPriceChange = (product, changeType) => {
    const history = Object.keys(product.history).map(k => product.history[k])
    if (history.length > 1) {
        const newPrice = Number(history.pop()),
            oldPrice = Number(history.pop())
        if (changeType === PRICE_INCREASE && newPrice > oldPrice)
            return _percentage(newPrice, oldPrice)
        else if (changeType === PRICE_DECREASE && newPrice < oldPrice)
            return _percentage(oldPrice, newPrice)
    }
}

export { track, updatePrice, checkPriceChange }
