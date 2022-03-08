import Vue from 'vue'

const EcommerceMenuRow = Vue.extend({
    name: 'EcommerceMenuRow',
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    render: function (h) {
        var options = {
            class: ['list-unstyled']
        }

        return h('ul', options, [
            this.items.map((item) => {
                var instance = Vue.component('RouterLink')
                var routerLink = new instance({ to: item.to, parent: this })
                return h('li', [routerLink])
            })
        ])
    }
})

const EcommerceMenu = Vue.extend({
    name: 'EcommerceMenu',
    props: {
        isVisible: {
            type: Boolean
        }
    },
    computed: {
        classList() {
            return [
                {
                    'show': this.isVisible
                }
            ]
        }
    },
    render: function (h) {
        var options = {
            
        }

        return h('div', options, [
            h('div', { class: 'row g-3' })
        ])
    }
})


export {
    EcommerceMenuRow,
    EcommerceMenu
}
