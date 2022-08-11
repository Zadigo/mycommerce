import { mediaUrl } from '@/utils'
import { computed, ref } from 'vue'
import { useShop } from '../store/shop'

export default function useTileComposable (app) {
  const selectedImage = ref(null)
  const playVideo = ref(false)

  const hasVideo = computed(() => {
    return Object.keys(app.props.productVideo || {}).length > 0
  })

  function getImageForIndex (images, index) {
    return mediaUrl(images[index].mid_size)
  }

  function selectImageWithIndex (images, index) {
    app.emit('select-image', getImageForIndex(index))
  }

  function doPlay () {
    const store = useShop()
    playVideo.value = !playVideo.value

    try {
      const items = this.$refs.videoSource.getElementsByTagName('video')
      items[0].play()
    } catch {
      app.emit('error-message', 'Could not start video')
      store.dispatch('addErrorMessage', 'Could not start video')
    }
  }

  return {
    selectedImage,
    playVideo,
    hasVideo,
    getImageForIndex,
    selectImageWithIndex,
    doPlay
  }
}
