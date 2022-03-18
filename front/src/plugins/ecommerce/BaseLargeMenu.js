import Vue from 'vue'
import './dist/css/ecommerce.css'

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

// const EcommerceMenu = Vue.extend({
//     name: 'EcommerceMenu',
//     props: {
//         isVisible: {
//             type: Boolean
//         }
//     },
//     computed: {
//         classList() {
//             return [
//                 {
//                     'show': this.isVisible
//                 }
//             ]
//         }
//     },
//     render: function (h) {
//         var options = {
            
//         }

//         return h('div', options, [
//             h('div', { class: 'row g-3' })
//         ])
//     }
// })

const EcommerceLargeMenu = Vue.extend({
    name: 'EcommerceLargeMenu',
    props: {
        isVisible: {
            type: Boolean
        }
    },
    render: function (h) {
        var options = {
            class: [
                'dropdown-menu',
                'megamanu'
            ]
        }
        return h('div', options, [
            this.$slots.default
        ])
    }
})


export {
    EcommerceLargeMenu,
    EcommerceMenuRow,
    // EcommerceMenu
}
