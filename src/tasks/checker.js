import co from 'co'
import { EmagTrackerAPI } from "../backend"
import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import { today, shortenString } from "../utils"
import { Scanner } from "../utils/scanner"
import { checkPriceChange } from "../utils/product"
import { adapt } from "../utils/settings"
import { bagdeBackgroundColor } from "../utils/notifications"

const alarmName = 'priceChecker'

const updateStartingPoint = (formattedDate, notify) =>
    StorageAPI.setSync({
        lastCheck: formattedDate
    }).catch(reason => {
        if (notify)
            NotificationsAPI.error(reason, 'scan.error.startingPoint')
    })

const updateProductsPrice = ({ notify, variationType, responseCallback }) => function* () {
    try {
        const date = yield StorageAPI.getSync('lastCheck')
        const now = today()

        if (now !== date.lastCheck) {
            updateStartingPoint(now, notify)

            const pids = yield StorageAPI.getSync(null)
            delete pids.lastCheck
            delete pids.settings
            for (const pid of Object.keys(pids)) {
                // first try to find them in the local store
                let product = yield StorageAPI.getLocal(pid)
                if ($.isEmptyObject(product)) {
                    // load product data from remote
                    product = yield EmagTrackerAPI.getProduct(pid)
                } else {
                    product = product[pid]
                }

                const newPrice = yield Scanner.scanProductHomepage(product)
                const percentage = checkPriceChange(product, newPrice, variationType)
                if (percentage) {
                    // TODO maybe add some flag to product in local store and display change in sidebar
                    if (notify)
                        NotificationsAPI.info('scan.title', 'scan.priceChanged.' + variationType, {
                            pid,
                            title: shortenString(product.title),
                            variation: percentage
                        }, pid)
                    NotificationsAPI.badgeColor(bagdeBackgroundColor(variationType))
                    NotificationsAPI.incrementBadgeCounter()
                }
            }
            if (notify && !$.isEmptyObject(pids))
                    NotificationsAPI.info('scan.title', 'scan.finished')
            if (typeof responseCallback === "function")
                responseCallback()
        }
        // set scan date if first run
        if ($.isEmptyObject(date)) {
            updateStartingPoint(now, notify)
        }
    } catch (e) {
        if (notify)
            NotificationsAPI.error(e, 'scan.error.default')
        if (typeof responseCallback === "function")
            responseCallback()
        console.log('Could not perform scheduled scan ' + e)
        console.log(e.stack)
    }
}

const initChecker = (settings, callback) => {

    const config = adapt(settings, callback)

    chrome.alarms.clear(alarmName, wasCleared => {

        chrome.alarms.create(alarmName, {
            delayInMinutes: 10,
            periodInMinutes: config.timeout
        })

        chrome.alarms.onAlarm.addListener(alarm => {
            if (alarm.name === alarmName) {
                co(updateProductsPrice(config))
            }
        })
    })
}

const triggerScan = (settings, callback) =>
    co(updateProductsPrice(adapt(settings, callback)))

export { initChecker, triggerScan }
