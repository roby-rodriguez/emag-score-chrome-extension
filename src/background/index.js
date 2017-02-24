import { initChecker } from "../tasks/checker"
import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import defaultSettings from "../utils/settings/defaultValues"

StorageAPI
    .getSync('settings')
    .then(data => {
        if ($.isEmptyObject(data)) {
            console.info('No user settings found. Using defaults.')
            initChecker(defaultSettings)
        } else {
            initChecker(data.settings)
        }
    })
    .catch(reason => {
        console.warn('Could not read user settings. ' + reason)
        console.info('Using defaults.')
        initChecker(defaultSettings)
    })

chrome.browserAction.onClicked.addListener(function () {
    NotificationsAPI.resetBadgeCounter()
    chrome.tabs.create({ url: chrome.runtime.getURL("browser_action.html") });
});
