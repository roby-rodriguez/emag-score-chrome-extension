import co from 'co'
import { EmagTrackerAPI } from "./duplicate"

/**
 * Promisify callback-based API call
 *
 * @param item
 * @returns {Promise}
 */
const getSync = item => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(item, found => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(found)
            }
        })
    })
}

/**
 * Promisify callback-based API call
 *
 * @param item
 * @returns {Promise}
 */
const getLocal = item => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(item, found => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(found)
            }
        })
    })
}

/**
 *
 */
export const load = () => {
    return getSync(null)
        .then(items => {
            delete items.lastCheck
            if ($.isEmptyObject(items)) {
                // show some text - no products marked yet
                return Promise.reject("No products tracked yet")
            } else {
                return co(function* () {
                        const remoteProducts = []
                        for (let pid of Object.getOwnPropertyNames(items)) {
                            const remote = yield EmagTrackerAPI.getProduct(pid)
                            if ($.isEmptyObject(remote)) {
                                console.warn("Remote fetch failed for pid=" + pid + ". Loading from local. Problem was ")
                                const local = yield getLocal(pid)
                                remoteProducts.push(local)
                            } else {
                                remoteProducts.push(remote)
                            }
                        }
                        return remoteProducts
                    })
            }
        })
}
