import co from 'co'
import { EmagTrackerAPI } from "../../backend"
import { StorageAPI } from "../../storage"

/**
 * Load user products from remote or local if not available
 */
export const load = () =>
    StorageAPI.getSync(null)
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
                                const local = yield StorageAPI.getLocal(pid)
                                remoteProducts.push(local)
                            } else {
                                remoteProducts.push(remote)
                            }
                        }
                        return remoteProducts
                    })
            }
        })
