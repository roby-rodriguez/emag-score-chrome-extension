import Sidebar from "../Sidebar"
import { i18n } from "../../mixin"
import messages from "./messages"

// TODO fix browser_action.build.js output paths like:
// Component.options.__file = "/home/<<username>>/WebstormProjects/emag-score-chrome-extension/src

export default {
    mixins: [ i18n(messages, "swal") ],
    components: {
        Sidebar
    }
}
