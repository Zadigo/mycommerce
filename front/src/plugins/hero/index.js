import { intro, introContainer, introMask } from './components'

import './css/hero.css'

export default {
    install(Vue) {
        Vue.component('intro-container', introContainer)
        Vue.component('intro-mask', introMask)
        Vue.component('intro', intro)
    }
}
