(function() {

    var alarmName = 'priceChecker'

    function updateStartingPoint(formattedDate) {
        chrome.storage.sync.set({
            lastCheck: formattedDate
        }, function () {
            if (chrome.runtime.lastError)
                console.error("Could not set starting point. Problem was " + chrome.runtime.lastError.message)
        })
    }

    // 1 - setup starting point
    var now = moment(new Date()).format('DD-MM-YYYY')
    updateStartingPoint(now)

    //TODO make this configurable
    // on minutes option change - reset alarm
    // 2 - create alarm
    chrome.alarms.create(alarmName, {
        delayInMinutes: 1,
        periodInMinutes: 1
    })

    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name === alarmName) {
            chrome.storage.sync.get('lastCheck', function (date) {
                var now = moment(new Date()).format('DD-MM-YYYY')
                if (now !== date.lastCheck) {
                    console.log('Started scheduled scan')
                    updateStartingPoint(now)

                    // get all user-marked products
                    chrome.storage.sync.get(null, function(pids) {
                        delete pids.lastCheck
                        for (var pid in pids) {
                            // first try to find them in the local store
                            chrome.storage.local.get(pid, function (local) {
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
            })
        }
    })
})()
