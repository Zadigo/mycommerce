export default (client) => ({
    myOrders() {
        return client({
            method: 'get',
            url: '/orders'
        })
    },

    profile: () => {
        return client({
            url: '/profile',
            method: 'get'
        })
    },

    login: (credentials) => {
        let { email, password } = credentials
        return client({
            url: '/login',
            method: 'post',
            data: { email: email, password: password }
        })
    },

    signup: (name, email, password) => {
        return client({
            url: '/signup',
            method: 'post',
            data: { name: name, email: email, password: password }
        })
    }
})
