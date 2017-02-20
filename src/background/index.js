import { initChecker } from "../tasks/checker"
import { NotificationsAPI } from "../notifications"

initChecker()

chrome.browserAction.onClicked.addListener(function () {
    NotificationsAPI.resetBadgeCounter()
    chrome.tabs.create({ url: chrome.runtime.getURL("browser_action.html") });
});
