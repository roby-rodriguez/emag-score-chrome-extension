import co from 'co'
import { EmagTrackerAPI } from "../backend"
import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import { today } from "../utils"
import { scanProductHomepage } from "../utils/scanner"
import { checkPriceChange } from "../utils/product"
import { bagdeBackgroundColor, priceChangedText } from "../utils/notifications"

const alarmName = 'priceChecker'

const updateStartingPoint = (formattedDate, allowNotifications) =>
    StorageAPI.setSync({
        lastCheck: formattedDate
    }).catch(reason => {
        if (allowNotifications)
            NotificationsAPI.error(reason, 'Could not set starting point')
    })

const updateProductsPrice = settings => function* () {
    try {
        const date = yield StorageAPI.getSync('lastCheck')
        const now = today()

        if (now !== date.lastCheck) {
            updateStartingPoint(now, settings.notifications.allow)

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

                const variationType = settings.notifications.priceVariation
                const newPrice = yield scanProductHomepage(product)
                const percentage = checkPriceChange(product, newPrice, variationType)
                if (percentage) {
                    // TODO maybe add some flag to product in local store and display change in sidebar
                    if (settings.notifications.allow)
                        NotificationsAPI.info(priceChangedText(pid, percentage, variationType), 'Price change', pid)
                    NotificationsAPI.badgeColor(bagdeBackgroundColor(variationType))
                    NotificationsAPI.incrementBadgeCounter()
                }
            }
            if (settings.notifications.allow && !$.isEmptyObject(pids))
                NotificationsAPI.info('Scan finished', 'Scheduled scan')
        }
        // set scan date if first run
        if ($.isEmptyObject(date)) {
            updateStartingPoint(now, settings.notifications.allow)
        }
    } catch (e) {
        if (settings.notifications.allow)
            NotificationsAPI.error(e, 'Could not perform scheduled scan')
        console.log('Could not perform scheduled scan ' + e)
        console.log(e.stack)
    }
}

const initChecker = settings => {

    chrome.alarms.create(alarmName, {
        delayInMinutes: 10,
        periodInMinutes: settings.scan.timeout
    })

    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === alarmName) {
            co(updateProductsPrice(settings))
        }
    })
}

const resetChecker = settings =>
    chrome.alarms.create(alarmName, {
        when: Date.now(),
        periodInMinutes: settings.scan.timeout
    })

export { initChecker, resetChecker }
