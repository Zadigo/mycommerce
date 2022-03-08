import Vue from 'vue'

export default Vue.extend({
    name: 'intro-container',
    props: {
        alignItems: {
            type: String,
            default: 'center'
        },
        justifyContent: {
            type: String,
            default: 'center'
        },
        textCenter: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        computedClass() {
            return [
                'container',
                'd-flex',
                {
                    [`align-items-${this.alignItems}`]: true,
                    [`justify-content-${this.justifyContent}`]: true,
                    'text-center': this.textCenter,
                },
                'h-100'
            ]
        }
    },
    render: function (h) {
        var options = {
            class: this.computedClass,
            ref: 'container'
        }

        return h('div', options, [this.$slots.default])
    }
})
