/*
 * Implements funtionnalities for associating images to
 * to a product, loading images etc.
 */

// import _ from 'lodash'
import { buildLimitOffset, listManager, limitAndOffsetAsParams } from '@/utils'

export default {
    data: () => ({
        cachedResponse: {},
        images: [],
        isLoading: false,
        newAssociation: {
            product: null
        }
    }),
    methods: {
        async loadImages(callback) {
            try {
                this.isLoading = true
                var response = await this.axios.get(`shop/dashboard/images?${limitAndOffsetAsParams(100, 0).toString()}`)
                var cachedResponse = response.data

                this.cachedResponse = cachedResponse
                this.images = cachedResponse.results
                this.$session.create('images', cachedResponse)
                this.isLoading = false

                if (callback && typeof callback == 'function') {
                    callback()
                }
                // this.scrollToTop()
            } catch (error) {
                console.log(error)
            }
        },

        async loadImagesViaUrl(url) {
            try {
                this.isLoading = true
                var response = await this.axios.get(`shop/dashboard/images?${buildLimitOffset(url).toString()}`)
                var cachedResponse = response.data

                this.cachedResponse = cachedResponse
                this.images = cachedResponse.results
                this.$session.create('images', cachedResponse)
                this.isLoading = false
                // this.scrollToTop()
            } catch (error) {
                console.log(error)
            }
        },

        async associateImagesToProduct(callback) {
            try {
                var data = this.newAssociation

                data['images'] = this.selectedImages

                if (!data['product']) {
                    data['product'] = this.$route.params.id
                }

                var response = this.axios.post(`shop/dashboard/products/${data.product}/images/associate`, data)
                this.selectedImages = []
                
                if (callback && typeof callback == 'function') {
                    callback()
                }
                response
            } catch (error) {
                console.log(error)
            }
        },

        loadPrevious() {
            this.loadImagesViaUrl(this.cachedResponse.previous)
        },

        loadNext() {
            this.loadImagesViaUrl(this.cachedResponse.next)
        },

        getProductId() {
            return this.$route.params.id
        },
        
        selectImage(image) {
            this.selectedImages = listManager(this.selectedImages, image.id)
        }

        // updateCurrentProductImages() {
        //     var product = _.find(this)
        // }
    }
}
