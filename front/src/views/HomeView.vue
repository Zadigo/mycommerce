<template>
  <section id="home">
    <intro :image="require('@/assets/hero.jpg')">
      <intro-mask :opacity="0.3">
        <intro-container>

          <div class="text-white">
            <h1 v-font-size="54" class="mb-3">Assouvis tes ardents désir</h1>
            <h5 class="mb-4">Craquez pour nos nouveautés signées Lounge</h5>

            <router-link :to="{ name: 'collection_all' }" class="btn btn-outline-light btn-lg m-2" role="button">
              Découvrir
            </router-link>
          </div>
        
        </intro-container>
      </intro-mask>
    </intro>

    <!-- <div ref="intro" id="intro" class="bg-image shadow-2-strong">
      <div ref="mask" class="mask" style="background-color: rgba(0, 0, 0, 0.3);">
        <div class="container d-flex align-items-center justify-content-center text-center h-100">
          <div class="text-white">
            <h1 v-font-size="54" class="mb-3">Assouvis tes ardents désir</h1>
            <h5 class="mb-4">Craquez pour nos nouveautés signées Lounge</h5>

            <router-link :to="{ name: 'collection_all' }" class="btn btn-outline-light btn-lg m-2" role="button">
              Découvrir
            </router-link>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Hottest products -->
    <section id="products" class="my-6">
      <v-container>
        <v-row>
          <v-col cols="12">
            <p class="font-weight-bold fs-22">Faire des achats</p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Banner - 1 -->
    <section class="banner">
      <div class="d-flex justify-content-between">
        <div id="left">
          <v-img :src="require('@/assets/side2.jpg')" class="mr-2"></v-img>
          <div id="title">
            <p>Beaux bas</p>
            <v-btn>Découvrir</v-btn>
          </div>
        </div>
        
        <div id="right">
          <v-img :src="require('@/assets/side2.jpg')"></v-img>
          <div id="title">
            <p>Un style basique. Mais en mieux</p>
            <v-btn>Découvrir</v-btn>
          </div>
        </div>
      </div>
    </section>

    <!-- <section class="banner banner-img" :style="`background-image: url('${require('@/assets/side1.jpg')}');`">
      <div class="mask" style="background-color: rgba(0, 0, 0, 0.2);">
        <div id="title">
          <p class="font-weight-bold text-center">Renouvellez votre garde-robe</p>
        </div>
      </div>
    </section> -->

    <!-- Banner - 2 -->
    <section class="banner-absolute">
      <v-img :src="require('@/assets/side1.jpg')"></v-img>

      <div class="title">
        <p>Renouvellez votre garde-robe</p>
        <v-btn>Découvrir</v-btn>
      </div>
    </section>
  </section>
</template>


<script>
export default {
  name: 'HomeView',
  
  title: () => 'Chic lingerie'
}
</script>

<style scoped>
  #home {
    z-index: -3;
  }
   #intro {
      /* background-image: url("https://mdbootstrap.com/img/new/fluid/city/018.jpg"); */
      height: 100vh;
    }

    /* Height for devices larger than 576px */
    /* @media (min-width: 992px) {
      #intro {
        margin-top: -58.59px;
      }
    } */

    /* .navbar .nav-link {
      color: #fff !important;
    } */
    .banner {
      position: relative;
      width: 100%;
      max-width: 100%;
      height: 600px;
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
      /* height: 100%; */
      max-width: 100%;
      object-fit: cover;
      object-position: center;
    }
    .banner #left, #something1 #right {
      position: relative;
      width: 50%;
      height: 600px;
      overflow: hidden;
    }
    .banner .title, .banner-absolute .title {
      position: absolute;
      bottom: 0;
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
</style>
