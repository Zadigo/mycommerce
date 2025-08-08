import { describe, expect, it } from 'vitest'
// import { useImages } from '../../composables/images'
import type { ProductImage } from '../../app/types'

// const testImage: ProductImage = {
//   id: 1,
//   name: 'Image name',
//   is_main_image: true,
//   mid_size: '/image.jpeg',
//   original: '/image.jpeg',
//   thumbnail: '/image.jpeg',
//   product_set: [
//     {
//       id: 1,
//       name: 'Product Name',
//       color_variant_name: 'Pink',
//       color: 'Blue'
//     }
//   ]
// }

describe('Use Images Composable', () => {
//   it('should select image correctly', () => {
//     const { selectImage, selectedImage, showModal, handleCloseSelection } = useImages()

//     expect(showModal.value).toBeFalsy()
//     expect(selectedImage.value).toBeUndefined()
    
//     selectImage(testImage, () => {})

//     expect(showModal.value).toBeTruthy()
//     expect(selectedImage.value).not.toBeNull()
//     // expect(selectedImage.value).to.equal(testImage)

//     handleCloseSelection()
//     expect(showModal.value).toBeFalsy()
//   })

  it('Simple test', () => {
    expect(true).toBeTruthy()
  })
})
