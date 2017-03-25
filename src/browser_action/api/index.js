import co from 'co'
import { EmagTrackerAPI } from "../../backend"
import { StorageAPI } from "../../storage"
import { NotificationsAPI } from "../../notifications"
import { clean } from "../../utils/settings"

/**
 * Load user products from remote or local if not available
 */
export const load = ({ onlineData, caching, notify }) =>
    co(function* () {
        const pids = clean(yield StorageAPI.getSync(null))
        if ($.isEmptyObject(pids)) {
            throw new Error("No products tracked yet")
        } else {
            const products = []
            for (let pid of Object.getOwnPropertyNames(pids)) {
                let product = {}
                if (onlineData && !caching) {
                    product = yield EmagTrackerAPI.getProduct(pid)
                }
                if ($.isEmptyObject(product)) {
                    if (onlineData && !caching)
                        console.warn("Remote fetch failed for pid=" + pid + ". Attempting to load from local.")
                    product = yield StorageAPI.getLocal(pid)
                    if (notify && $.isEmptyObject(product))
                        NotificationsAPI.info('error.title', 'productNotFound', { pid })
                    else
                        products.push(product[pid])
                } else
                    products.push(product)
            }
            return products
        }
    })
