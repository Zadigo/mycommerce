export default (client) => ({
    images: {
        all (url) {
            var limit = 100
            var offset = 0
            
            if (url) {
                var instance = new URL(url)
                var potentialLimit = instance.searchParams.get('limit')
                var potentialOffset = instance.searchParams.get('offset')

                limit = potentialLimit ? potentialLimit : 100
                offset = potentialOffset ? potentialOffset : 0
            }

            var path = new URLSearchParams({ limit: limit, offset: offset })

            return client({
                method: 'get',
                url: `/images?${ path.toString() }`
            })
        }
    },

    products: {
        all () {
            // TODO: Add pagination code
            return client({
                method: 'get',
                url: '/dashboard/products'
            })
        },

        generic () {
            return client({
                method: 'get',
                url: '/dashboard/products/generic'
            })
        },

        associateImages (data) {
            let { product, images } = data

            return client ({
                method: 'post',
                url: `/dashboard/products/${ product }/associate`,
                data: { images: images }
            })
        },

        rename (data) {
            return client ({
                method: 'post',
                url: `/dashboard/products/rename`,
                data: data
            })
        },

        update (updates) {
            return client({
                method: 'post',
                url: `/dashboard/products/${ updates.id }/update`,
                data: updates
            })
        }
    }
})
