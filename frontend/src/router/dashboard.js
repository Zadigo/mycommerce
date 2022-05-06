import { loadView, loadLayout } from '@/utils'

export default [
    {
        path: '/dashboard',
        component: loadLayout('dashboard/DashboardContent'),
        children: [
            {
                path: '',
                name: 'dashboard_index_view',
                meta: {
                    text: 'Home',
                    icon: 'home',
                    adminLink: true,
                    forAdmin: true
                },
                component: loadView('dashboard/IndexView')
            },
            {
                path: 'products',
                name: 'dashboard_products_view',
                meta: {
                    text: 'Products',
                    icon: 'table',
                    adminLink: true,
                    forAdmin: true
                },
                // component: loadView('dashboard/ProductsView')
            },
            {
                path: 'products/:id',
                name: 'dashboard_product_view',
                meta: {
                    text: 'Product',
                    icon: 'table',
                    forAdmin: true
                },
                // component: loadView('dashboard/ProductView')
            },
            {
                path: 'images',
                name: 'dashboard_images_view',
                meta: {
                    text: 'Images',
                    icon: 'images',
                    adminLink: true,
                    forAdmin: true
                },
                // component: loadView('dashboard/ProductsImagesView')
            },
            {
                path: 'images/:id(\\d+)',
                name: 'dashboard_image_view',
                meta: {
                    text: 'Image',
                    icon: 'image',
                    forAdmin: true
                },
                // component: loadView('dashboard/ProductImageView')
            }
        ]
    }
]
