import { mapGetters } from 'vuex'
import { i18n } from "../../mixin"
import messages from "./messages"

export default {
    mixins: [ i18n(messages) ],
    computed: {
        icon: () => chrome.extension.getURL("res/icons/icon48.png")
    }
}
