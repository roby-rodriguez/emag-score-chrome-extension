import co from 'co'
import { EmagTrackerAPI } from "../../backend"
import { StorageAPI } from "../../storage"
import { NotificationsAPI } from "../../notifications"

/**
 * Load user products from remote or local if not available
 */
export const load = allowNotifications =>
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
                        const remoteProducts = []
                        for (let pid of Object.getOwnPropertyNames(items)) {
                            const remote = yield EmagTrackerAPI.getProduct(pid)
                            if ($.isEmptyObject(remote)) {
                                console.warn("Remote fetch failed for pid=" + pid + ". Attempting to load from local.")
                                const local = yield StorageAPI.getLocal(pid)
                                if ($.isEmptyObject(remote)) {
                                    if (allowNotifications)
                                        NotificationsAPI.error("Could not find product " + pid)
                                } else {
                                    remoteProducts.push(local)
                                }
                            } else {
                                remoteProducts.push(remote)
                            }
                        }
                        return remoteProducts
                    })
            }
        })
