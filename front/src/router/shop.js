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
    }
]
