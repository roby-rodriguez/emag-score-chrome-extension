import co from 'co'
import moment from 'moment'
import { EmagTrackerAPI } from "../backend"
import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import { scanProductHomepage } from "../utils/scanner"
import { checkPriceChange } from "../utils/product"
// TODO remove this later
import { PRICE_DECREASE } from "../utils/product/priceChangeType"

const alarmName = 'priceChecker'

const updateStartingPoint = formattedDate =>
    StorageAPI.setSync({
        lastCheck: formattedDate
    }).catch(reason => {
        NotificationsAPI.error(reason, 'Could not set starting point')
    })

const updateProductsPrice = function* () {
    try {
        const date = yield StorageAPI.getSync('lastCheck')
        const now = moment(new Date()).format('DD-MM-YYYY')

        if (now !== date.lastCheck) {
            updateStartingPoint(now)

            const pids = yield StorageAPI.getSync(null)
            delete pids.lastCheck
            delete pids.settings
            for (const pid of Object.keys(pids)) {
                // first try to find them in the local store
                let product = yield StorageAPI.getLocal(pid)
                if ($.isEmptyObject(product)) {
                    // load product data from remote
                    let product = yield EmagTrackerAPI.getProduct(pid)
                } else {
                    product = product[pid]
                }
                // TODO make this configurable
                // increment counter badge if price goes down
                const newPrice = yield scanProductHomepage(product)
                const change = checkPriceChange(product, newPrice, PRICE_DECREASE)
                if (change) {
                    // TODO add some flag to product in local store and display change in sidebar
                    NotificationsAPI.info('Tracked product ' + pid + ' is now '+ change + '% cheaper!', 'Price change', pid)
                    NotificationsAPI.badgeColor('#5fba7d') // green for decrease try #C91D2E red for increase
                    NotificationsAPI.incrementBadgeCounter()
                }
            }
        }
        // set scan date if first run
        if ($.isEmptyObject(date)) {
            updateStartingPoint(now)
        }
    } catch (e) {
        NotificationsAPI.error(e, 'Could not perform scheduled scan')
        console.log('Could not perform scheduled scan ' + e)
        console.log(e.stack)
    }
}

const initChecker = () => {
    //TODO make this configurable
    // on minutes option change - reset alarm
    // 2 - create alarm
    chrome.alarms.create(alarmName, {
        delayInMinutes: 1,
        periodInMinutes: 1
    })

    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === alarmName) {
            co(updateProductsPrice)
        }
    })
}

export { initChecker }
