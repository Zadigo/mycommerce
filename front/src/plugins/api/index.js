import auth from './auth'
import shop from './shop'

export default (client) => ({
    shop: shop(client),
    auth: auth(client)
})
