import { loadView } from '@/router/utils'

export default [
    {
        path: '',
        name: 'home_view',
        component: loadView('shop/HomeView')
    },
    {
        path: 'collections/:collection([a-z-]+)',
        name: 'collection_details_view',
        component: loadView('shop/CollectionView')
    },
    {
        path: 'products/:id(\\d+)/:slug([a-z-]+)',
        name: 'product_view',
        component: loadView('shop/ProductView')
    },
]
