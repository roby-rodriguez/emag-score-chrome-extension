import { initChecker } from '../tasks/checker'

initChecker()

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("browser_action.html") });
});
