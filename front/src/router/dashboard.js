import { loadView, loadLayout } from '@/router/utils'

export default [
    {
        path: '/dashboard',
        component: loadLayout('DashboardContent'),
        children: [
            {
                path: '',
                name: 'dashboard_index_view',
                meta: {
                    text: 'Home',
                    icon: 'home',
                    adminLink: true
                },
                component: loadView('dashboard/IndexView')
            },
            {
                path: 'images',
                name: 'dashboard_images',
                meta: {
                    text: 'Images',
                    icon: 'images',
                    adminLink: true
                },
                component: loadView('dashboard/ProductsImagesView')
            },
        ]
    }
]
