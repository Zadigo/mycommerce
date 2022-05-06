// import { loadLayout, loadView } from '@/utils'
// import i18n from '@/i18n'

export default [
    {
        path: 'account',
        // component: loadLayout('BaseAccount'),
        children: [
            {
                path: '',
                name: 'account_home_view',
                meta: {
                    requiresAuthentication: true
                },
                // component: () => import('@/components/shop/account/Home.vue')
            },
            {
                path: 'your-account',
                name: 'your_account_view',
                meta: {
                    // FIXME: Throws error
                    // pageTitle: i18n.t('your_account')
                    pageTitle: 'Your account'
                },
                // component: () => import('@/components/shop/account/YourAccount.vue')
            },
        ]
    }
]
