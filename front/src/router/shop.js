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
    {
        path: 'cart',
        name: 'cart_view',
        component: loadView('shop/CartView')
    },
    {
        path: 'cart/shipment',
        name: 'shipment_view',
        component: loadView('shop/ShipmentView')
    },
    {
        path: 'likes',
        name: 'wishlists_view',
        component: loadView('shop/LikedProductsView')
    },
    {
        path: 'login',
        name: 'login_view',
        meta: {
            isFullPage: true
        },
        component: loadView('shop/auth/LoginView')
    },
    {
        path: 'store-locations',
        name: 'store_locations_view',
        component: loadView('shop/StoreFinderView')
    }
]
