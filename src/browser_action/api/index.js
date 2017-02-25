import co from 'co'
import { EmagTrackerAPI } from "../../backend"
import { StorageAPI } from "../../storage"
import { NotificationsAPI } from "../../notifications"

/**
 * Load user products from remote or local if not available
 */
export const load = (onlineData, allowNotifications) =>
    StorageAPI
        .getSync(null)
        .then(items => {
            delete items.lastCheck
            delete items.settings
            if ($.isEmptyObject(items)) {
                // show some text - no products marked yet
                return Promise.reject("No products tracked yet")
            } else {
                return co(function* () {
                        const products = []
                        for (let pid of Object.getOwnPropertyNames(items)) {
                            let product = {}
                            if (onlineData) {
                                product = yield EmagTrackerAPI.getProduct(pid)
                            }
                            if ($.isEmptyObject(product)) {
                                if (onlineData)
                                    console.warn("Remote fetch failed for pid=" + pid + ". Attempting to load from local.")
                                product = yield StorageAPI.getLocal(pid)
                                if (allowNotifications && $.isEmptyObject(product))
                                    NotificationsAPI.error("Could not find product " + pid)
                                else
                                    products.push(product[pid])
                            } else
                                products.push(product)
                        }
                        return products
                    })
            }
        })
