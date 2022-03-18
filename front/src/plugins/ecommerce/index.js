// import { EcommerceLargeMenu, EcommerceMenuRow } from './BaseLargeMenu'
import EcommerceMegaMenu from "./EcommerceMegaMenu"

export default {
    install(Vue) {
        Vue.component('ecommerce-megamenu', EcommerceMegaMenu)
        
        // Vue.component('ecommerce-menu-row', EcommerceMenuRow)
        // Vue.component('ecommerce-large-menu', EcommerceLargeMenu)

        // v-e-menu.megamenu
        // Vue.directive('e-menu', {
        //     inserted(el, binding, vnode) {
        //         vnode

        //         const modifiers = binding.modifiers || {}
        //         const options = { passive: true }
        //         modifiers
        //         // const value = binding.value
        //         // const handler = typeof value == 'function' ? value : value.handler
        //         const target = document.querySelector(`.${binding.arg}`)

        //         if (!target) { return }

        //         const listener = event => {
        //             console.log(event)
        //             if (target.classList.contains('show')) {
        //                 target.classList.remove('show')
        //             } else {
        //                 target.classList.add('show')
        //             }
        //         }

        //         el.addEventListener('mouseenter', listener, options)
        //         target.addEventListener('mouseleave', listener, options)
        //     }
        // })




        // var changeFontSize = (el, size) => {
        //     el.style.fontSize = `${size}px`
        // }

        // var applyModifiers = (el, modifiers) => {
        //     var authorized = ['uppercase', 'lowercase']
            
        //     Object.keys(modifiers).forEach((modifier) => {
        //         if (authorized.includes(modifier)) {
        //             if (modifier === 'uppercase') {
        //                 el.style.textTransform = 'uppercase'
        //             }
        //         }
        //     })
        // }

        // var removeModifiers = (el, modifiers) => {
        //     var items = Object.keys(modifiers)

        //     if (!items.includes('uppercase')) {
        //         el.style.textTransform = 'none'
        //     }
        // }
        
        // Vue.directive('font-size', {
        //     inserted(el, binding) {
        //         var modifiers = binding.modifiers || {}

        //         if (typeof binding.value !== 'number') {
        //             throw `Font size expected a number but got: ${binding.value}`
        //         } else {
        //             changeFontSize(el, binding.value)
        //         }

        //         applyModifiers(el, modifiers)
        //     },

        //     update(el, binding) {
        //         var modifiers = binding.modifiers || {}

        //         if (binding.oldValue !== binding.value) {
        //             changeFontSize(el, binding.value)
        //         }
        //         removeModifiers(el, modifiers)
        //         applyModifiers(el, modifiers)
        //     }
        // })
    }
}
