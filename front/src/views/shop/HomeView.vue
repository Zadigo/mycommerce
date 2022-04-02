<template>
  <section id="home">
    <!-- Intro -->
    <intro :image="require('@/assets/hero4.jpg')">
      <intro-mask :opacity="0.3">
        <intro-container>
          <div class="text-white">
            <h1 class="mb-3 lead">Assouvis tes ardents désir</h1>
            <h5 class="mb-4 lead-smaller">Craquez pour nos nouveautés signées Lounge</h5>

            <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale  } }" class="btn btn-light btn-lg" role="button">
              {{ $t('Discover') }}
            </router-link>
          </div>
        </intro-container>
      </intro-mask>
    </intro>

    <!-- Banner - 1 -->
    <section class="banner my-2">
      <div id="left">
        <v-img :src="require('@/assets/side1.jpg')" height="500"></v-img>
        <div id="title">
          <p>Audacieux et beau</p>
          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale  } }" class="btn btn-dark">
            {{ $t('Discover') }}
          </router-link>
        </div>
      </div>
      
      <div id="right">
        <v-img :src="require('@/assets/side2.jpg')" height="500"></v-img>
        <div id="title">
          <p>Un style basique. Mais en mieux</p>
          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale  } }" class="btn btn-dark">
            {{ $t('Discover') }}
          </router-link>
        </div>
      </div>
    </section>

    <section class="banner my-2">
      <v-img :src="require('@/assets/side3.jpg')" height="500"></v-img>
      <div id="title" class="w-100 text-center">
        <p>Birthday mode: activating</p>
        <p>Our Birthday Sale is coming soon. Sign up for early access</p>
        <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale  } }" class="btn btn-dark btn-lg">
          {{ $t('Discover') }}
        </router-link>
      </div>
    </section>
  </section>
</template>


<script>
export default {
  name: 'HomeView',
  title() {
    return 'Chic lingerie'
  }
}
</script>

<style scoped>
  #home {
    z-index: -3;
  }
  .banner {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: nowrap;
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 400px;
    overflow: hidden;
  }
  .banner-absolute {
    position: relative;
    max-width: 100%;
    height: 600px;
    min-height: 400px;
    width: 100%;
    overflow: hidden;
  }
  .banner-absolute img {
    width: 100%;
    max-width: 100%;
    object-fit: cover;
    object-position: center;
  }
  .banner #left, .banner #right {
    position: relative;
    width: 50%;
    overflow: hidden;
  }
  .banner #title, .banner-absolute #title {
    position: absolute;
    left: 0;
    bottom: 10%;
    font-size: 28px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    padding: 2rem;
  }
  .banner.banner-img {
    background-position: center;
    background-repeat: no-repeat;
  }

  .box {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 3px;
    min-height: 600px;
    width: 100%;
    height: auto;
    padding: 2rem;
    overflow-x: scroll;
  }

  .box .content-wrapper {
    height: auto;
  }
</style>
