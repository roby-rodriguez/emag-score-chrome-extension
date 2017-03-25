import { i18n } from "../../mixin"
import messages from "./messages"

export default {
    mixins: [ i18n(messages) ],
    methods: {
        save() {
            this.$store.dispatch('saveSettings')
                .then(() => swal(this.i18n('saved.title'), this.i18n('saved.message'), "success"))
                .catch(error => swal(this.i18n('error.title','app'), this.i18n('error.message','app', { error }), "error"))
        },
        reset() {
            this.$store.dispatch('resetSettings')
                .then(() => swal(this.i18n('reseted.title'), this.i18n('reseted.message'), "info"))
                .catch(error => swal(this.i18n('error.title','app'), this.i18n('error.message','app', { error }), "error"))
        }
    }
}
