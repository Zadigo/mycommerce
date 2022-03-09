<template>
  <section id="dashboard">
    <top-header />

    <main style="margin-top: 58px">
      <div class="container pt-4">

        <transition name="general-transition">  
          <router-view name="content" />
        </transition>
      
      </div>
    </main>

  </section>
</template>

<script>
import TopHeader from './TopHeader.vue'

export default {
  components: {
    TopHeader
  }  
}
</script>
