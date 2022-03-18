import VideoTile from './VideoTile'

export default {
    components: {
        VideoTile
    },
    props: {
        images: {
            type: Array,
            required: true
        },
        productVideo: {
            type: Object,
            default: () => {}
        }
    },

    data: () => ({
        playVideo: false
    }),

    computed: {
        hasVideo() {
            if (!this.productVideo) {
                return false
            } else {
                return Object.keys(this.productVideo).length > 0
            }
        }
    },
    methods: {
        getImageForIndex(index) {
            return this.$options.filters.mediaUrl(this.images[index].mid_size)
        },

        selectImageWithIndex(index) {
            this.$emit('select-image', this.getImageForIndex(index))
        },
        
        doPlay() {
            this.playVideo = !this.playVideo

            try {
                var items = this.$refs.videoSource.getElementsByTagName('video')
                items[0].play()
            } catch {
                this.$store.dispatch('addErrorMessage', 'Could not start video')
            }
        }
    }
}
