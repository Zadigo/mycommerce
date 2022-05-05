// import { h } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import shop from "./shop"
// import { RouterView } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => { window.scroll(0, 0) },
    routes: [
        {
            path: '/:lang',
            // components: {
            //     default: h('router-view', RouterView)
            // },
            component: {
                template: '<router-view></router-view>'
            },
            children: [
                ...shop
            ]
        }
    ]
})

export default router
