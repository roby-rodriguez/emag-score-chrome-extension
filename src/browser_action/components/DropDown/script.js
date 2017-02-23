export default {
    props: {
        id: {
            default: 'dropdown' + Date.now()
        },
        // selected value
        value: {
            default: null
        },
        title: {
            default: '',
        },
        options: {
            type: Array,
            default() {
                return []
            }
        }
    },
    computed: {
        displayTitle() {
            const selected = this.options.find(o => o.value === this.value)
            return  selected ? selected.label : this.title
        }
    },
    methods: {
        isSelected(value) {
            return value === this.value
        },
        select(p) {
            this.$emit('dropdown-selected', p)
        }
    }
}
