import auth from './auth'
import dashboard from './dashboard'
import shop from './shop'

export default (client) => ({
    shop: shop(client),
    auth: auth(client),
    dashboard: dashboard(client)
})
