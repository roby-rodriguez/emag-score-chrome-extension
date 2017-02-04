import co from 'co'
import { EmagTrackerAPI } from "../../backend"
import { StoreAPI } from "../../store"

/**
 * Load user products from remote or local if not available
 */
export const load = () =>
    StoreAPI.getSync(null)
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
                                const local = yield StoreAPI.getLocal(pid)
                                remoteProducts.push(local)
                            } else {
                                remoteProducts.push(remote)
                            }
                        }
                        return remoteProducts
                    })
            }
        })
