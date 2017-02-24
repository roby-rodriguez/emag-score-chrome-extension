import bootstrapToggle from 'bootstrap-toggle.js'

const _config = ({on, off, special}) => {
    const cfg = { on, off }
    if (special) {
        cfg.style = "ios"
        cfg.onstyle="success"
        cfg.offstyle="danger"
    }
    return cfg
}

export default {
    props: [ "value", "on", "off", "special" ],
    mounted () {
        this.$toggle = $(this.$el)
        this.$toggle.bootstrapToggle(_config(this))
        this.$toggle.change(e => this.$emit('toggle-changed', !this.value))
    }
}
