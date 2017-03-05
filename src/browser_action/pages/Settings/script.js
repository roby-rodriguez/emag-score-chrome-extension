import { i18n } from "../../mixin"
import messages from "./messages"

export default {
    mixins: [ i18n(messages, true) ],
    methods: {
        save() {
            this.$store.dispatch('saveSettings')
                .then(() => swal("Saved", "Your settings have been saved", "success"))
                .catch(reason => swal("Oops...", "Something went wrong!\n\n" + reason, "error"))
        },
        reset() {
            this.$store.dispatch('resetSettings')
                .then(() => swal("Reset", "You are now using default settings", "info"))
                .catch(reason => swal("Oops...", "Something went wrong!\n\n" + reason, "error"))
        }
    }
}
