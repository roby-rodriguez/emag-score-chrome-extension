import $ from "jquery"
import { EmagTrackerAPI } from "../backend"
import { StorageAPI } from "../storage"
import { scanProductHomepage } from "../utils/scanner"

const alarmName = 'priceChecker'

const updateStartingPoint = formattedDate =>
    StorageAPI.setSync({
        lastCheck: formattedDate
    }).catch(reason => {
        console.error("Could not set starting point. Problem was " + JSON.stringify(reason))
    })

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

            StorageAPI.getSync('lastCheck', date => {

                const now = moment(new Date()).format('DD-MM-YYYY')
                if (now !== date.lastCheck) {
                    console.log('Started scheduled scan')
                    updateStartingPoint(now)

                    StorageAPI.getSync(null, pids => {

                        delete pids.lastCheck
                        for (var pid in pids) {

                            // first try to find them in the local store
                            StorageAPI.get(pid, local => {
                                if ($.isEmptyObject(local)) {

                                    // load product data from remote
                                    EmagTrackerAPI.getProduct(pid)
                                        .success(function (found) {
                                            scanProductHomepage(pid, found)
                                        })
                                        .fail(function(xhr, status, error) {
                                            console.warn("Could not get product from remote for pid=" + item + ". Scan aborted. " +
                                                "Problem was " + JSON.stringify({xhr: xhr, status: status, error: error}))
                                        })
                                } else {
                                    // scan this product's home page
                                    scanProductHomepage(pid, local)
                                }
                            })
                        }
                    })
                }
                // set scan date if first run
                if ($.isEmptyObject(date)) {
                    updateStartingPoint(now)
                }
            })
        }
    })
}

export { initChecker }
