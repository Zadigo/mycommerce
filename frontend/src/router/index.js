// import { h } from "vue"
import i18n from "@/i18n"
import { createRouter, createWebHistory } from "vue-router"
import accounts from "./accounts"
import dashboard from "./dashboard"
import shop from "./shop"
// import { RouterView } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => { window.scroll(0, 0) },
    routes: [
        {
            path: '/',
            component: null,
            redirect: {
                name: 'shop_view',
                params: i18n.global.locale
            }
        },
        {
            path: '/:lang',
            // components: {
            //     default: h('router-view', RouterView)
            // },
            component: {
                template: '<router-view></router-view>'
            },
            children: [
                ...shop,
                ...accounts,
            ]
        },
        ...dashboard,
        {
            path: '/cookie-settings',
            name: 'cookie_settings_view',
            // component: loadView('CookiesView')
        },
        {
            path: '/how-to-order',
            name: 'how_to_order_view',
            // component: loadView('CookiesView')
        },
        {
            path: '/how-to-track',
            name: 'how_to_track_view',
            // component: loadView('CookiesView')
        },
        {
            path: '/contact-us',
            name: 'contact_us_view',
            // component: loadView('CookiesView')
        },
        {
            path: '/payment-methods',
            name: 'payment_methods_view',
            // component: loadView('CookiesView')
        }
    ]
})

export default router
