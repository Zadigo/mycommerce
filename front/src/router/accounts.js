import { loadLayout } from '@/utils'
import i18n from '@/i18n'

export default [
    {
        path: 'account',
        component: loadLayout('BaseAccount'),
        children: [
            {
                path: '',
                name: 'account_home_view',
                meta: {
                    requiresAuthentication: true
                },
                component: () => import('@/components/shop/account/Home.vue')
            },
            {
                path: 'your-account',
                name: 'your_account_view',
                meta: {
                    pageTitle: i18n.t('your_account')
                },
                component: () => import('@/components/shop/account/YourAccount.vue')
            },
        ]
    }
]
