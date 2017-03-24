import { filterBy } from "../../../util/filters"
import { i18n } from "../../../mixin"
import messages from "./messages"

export default {
    mixins: [ i18n(messages) ],
    methods: {
        settings () {
            this.$router.push('/settings')
        },
        filter() {

        },
        refresh() {

        }
    }
}
