import { loadLayout, loadComponent } from './utils';

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
                component: loadComponent('shop/account/Home')
            },
        ]
    }
]
