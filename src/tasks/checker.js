import co from 'co'
import { EmagTrackerAPI } from "../backend"
import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import { today, shortenString } from "../utils"
import { Scanner } from "../utils/scanner"
import { checkPriceChange } from "../utils/product"
import { adapt, clean } from "../utils/settings"
import { bagdeBackgroundColor } from "../utils/notifications"

const alarmName = 'priceChecker'

const updateStartingPoint = (formattedDate, notify) =>
    StorageAPI.setSync({
        lastCheck: formattedDate
    }).catch(reason => {
        if (notify)
            NotificationsAPI.error(reason, 'scan.error.startingPoint')
    })

const updateProductsPrice = ({ onlineData, notify, variationType, responseCallback }) => function* () {
    try {
        const date = yield StorageAPI.getSync('lastCheck')
        const now = today()

        if (now !== date.lastCheck) {
            updateStartingPoint(now, notify)

            const changed = []
            const pids = clean(yield StorageAPI.getSync(null))
            for (const pid of Object.keys(pids)) {
                let product
                if (onlineData) {
                    // if user favors online data, always load from remote first
                    product = yield EmagTrackerAPI.getProduct(pid)
                    if ($.isEmptyObject(product)) {
                        product = yield StorageAPI.getLocal(pid)
                        if ($.isEmptyObject(product))
                            product = {}
                        else
                            product = product[pid]
                    }
                } else {
                    // otherwise attempt to load from local first and if not found load remote
                    product = yield StorageAPI.getLocal(pid)
                    if ($.isEmptyObject(product))
                        product = yield EmagTrackerAPI.getProduct(pid)
                    else
                        product = product[pid]
                }

                if ($.isEmptyObject(product))
                    console.warn("Checker did not find product with pid: " + pid)
                else {
                    yield Scanner.scanProductHomepage(product, onlineData)
                    const percentage = checkPriceChange(product, variationType)
                    if (percentage) {
                        changed.push(pid)
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
            }

            let variation
            if (changed.length)
                variation = variationType
            StorageAPI.setLocal({
                trending: { variation, changed }
            })

            if (notify && !$.isEmptyObject(pids))
                    NotificationsAPI.info('scan.title', 'scan.finished')
            if (typeof responseCallback === "function")
                responseCallback()
        }

        // set scan date if first run
        if ($.isEmptyObject(date))
            updateStartingPoint(now, notify)
    } catch (e) {
        if (notify)
            NotificationsAPI.error(e, 'scan.error.default')
        if (typeof responseCallback === "function")
            responseCallback()
        console.warn('Could not perform scheduled scan ' + e)
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
