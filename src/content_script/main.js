import { MessagingAPI } from "../messaging"
import { I18N } from "../utils/i18n"
import { initTracker } from "./index"
import { GET_LANGUAGE } from "../messaging/messageType"
import messages from "./messages"

MessagingAPI
    .send({
        type: GET_LANGUAGE
    })
    .then(lang => {
        I18N.init(messages, lang)
    })
    .catch(reason => {
        console.warn('Could not set language in content script. ' + reason.message)
        I18N.init(messages)
    })

$(initTracker)
