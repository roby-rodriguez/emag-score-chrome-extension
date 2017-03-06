import bootstrapToggle from 'bootstrap-toggle.js'
import messages from "./messages"

const _config = ({on, off, special, locale}) => {
    const cfg = { on, off }
    if (special) {
        cfg.style = "ios"
        cfg.onstyle="success"
        cfg.offstyle="danger"
    }
    if (locale) {
        cfg.on = messages[locale].on
        cfg.off = messages[locale].off
    }
    return cfg
}

export default {
    props: [ "value", "on", "off", "special", "locale" ],
    mounted () {
        this.$toggle = $(this.$el)
        this.$toggle.bootstrapToggle(_config(this))
        this.$toggle.change(e => this.$emit('toggle-changed', !this.value))
    },
    watch: {
        value() {
            if (this.value) {
                this.$toggle.parent().removeClass('btn-default off')
                this.$toggle.parent().addClass('btn-primary')
            } else {
                this.$toggle.parent().removeClass('btn-primary')
                this.$toggle.parent().addClass('btn-default off')
            }
        },
        locale() {
            this.$toggle.bootstrapToggle('destroy')
            this.$toggle.bootstrapToggle(_config(this))
        }
    }
}
