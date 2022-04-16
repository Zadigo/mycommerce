<template>
  <header id="page-header" ref="link" :class="headerClasses">
    <v-container>
      <v-row>
        <v-col cols="8">
          <!-- TODO: Implement header image -->
          <!-- <div class="header-image">
            <v-img :src="require('@/assets/banner.jpg')" height=""></v-img>
          </div> -->

          <p class="text-uppercase mb-5 fw-400">Collections</p>
          <h2>Dresses</h2>
          
          <p>
            Got plans? Then you'll need the right dress. The ultimate go-to piece to banish all of those 
            "nothing to wear" dilemmas, our range of must-have new season women's dresses online will have 
            you the best dressed for any occasion. From statement asymmetrical dresses for women to the 
            effortless cape dress, get ready to update your closet with a dress made for every occasion. 
            Nail 9-5 dressing with a simple...

            <!-- A-line women's dress, or channel some serious boss girl 
            vibes with a pleated or peplum dress and killer heels. Update your weekend wardrobe with 
            going out worthy dresses in figure-hugging fits and bold colour hues, or opt for an endlessly 
            versatile dress in a neutral hue you can reach for season after season. Prefer the laidback look? 
            Give your off-duty outfits a simple new go-to with our range of short sleeve dresses in easy to 
            wear jersey fabrics. Whether you’re looking for a mini or maxi hem, we've got the perfect dresses 
            online for you. Ensure you're dressed to impress with our offering of must-buy women's dresses. -->
          </p>

          <!-- TODO: Implement additional buttons for search -->
          <!-- <div>
            <v-chip v-for="i in 10" :key="i" class="mr-2" link>
              link {{ i }}
            </v-chip>
          </div> -->
        </v-col>
      </v-row>
    </v-container>
  </header>
</template>

<script>
export default {
  name: 'PageHeader',

  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    rounded: {
      type: Boolean
    },
    src: {
      type: String,
      default: null
    }
  },

  computed: {
    headerClasses () {
      return [
        'p-5',
        'mb-4 bg-light',
        'text-left',
        {
          'rounded-lg': this.rounded
        }
      ]
    }
  }
}
</script>

<style scoped>
#page-header {
  object-fit: cover;
  object-position: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.header-image {
  position: relative;
  overflow: hidden;
  height: 45vh;
}
</style>
