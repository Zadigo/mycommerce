export default (client) => ({
    products: {
        // TODO: Put the functionnalities of the filter
        // function in the all and use filter instead
        // of filterBy
        all () {
            return client({
                method: 'get',
                url: '/products'
            })
        },
    
        filter(url) {
            var limit = 100
            if (url) { limit = url.searchParams.get('limit') }
            // var offset = url.searchParams.get('offset')
            return client({
                method: 'get',
                url: `/products?limit=${limit}`
            })
        },

        filterBy(query) {
            var limit = 100
            return client({
                method: 'get',
                // Query must be: size=&color=
                url: `/products?limit=${ limit }&${ query }`
            })
        },

        variants(product) {
            return client({
                method: 'post',
                url: `/products/${ product.id }/variants`
            })
        }
    },

    cart: {
        all() {
            return client({
                method: 'get',
                url: `/cart`
            })
        },

        add(product, params) {
            return client({
                method: 'post',
                url: `/cart/add`,
                data: Object.assign({ product: product.id }, params)
            })
        }
    },
    
    lists: {
        all() {
            return client({
                method: 'get',
                url: `/wishlists`
            })
        },
        
        add(product, wishlist) {
            return client({
                method: 'post',
                url: `/wishlists/${ wishlist.id }/add`,
                data: { product: product.id }
            })
        },

        like(product) {
            return client({
                method: 'post',
                url: `/products/${ product.id }/like`
            })
        }
    }
})
