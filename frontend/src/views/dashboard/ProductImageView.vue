<template>
  <section id="image">
    <div class="row">
      <div class="col-12">
        <button type="button" class="btn btn-primary" @click="$router.go(-1)">Back</button>
        <button type="button" class="btn btn-primary" @click="previousImage">Previous</button>
        <button type="button" class="btn btn-primary" @click="nextImage">Next</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProductImageView',
  data () {
    return {
      images: [],
      currentlyViewedImage: {}
    }
  }
}
</script>
