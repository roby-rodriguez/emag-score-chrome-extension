import $ from 'jquery'
import { initTracker } from "./index"

window.i18next = chrome.extension.getBackgroundPage().i18next
$(initTracker)
