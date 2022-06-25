<template>
  <section id="collection" class="ecommerce-section loading-skeleton">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h2 class="mb-3 w-25 m-auto"></h2>
          <nav class="navbar shadow-none mb-1 w-50 m-auto"></nav>
        </div>

        <div class="col-12">
          <p class="m-0 mt-3 mb-3 m-auto w-25"></p>

          <div class="row">
            <div v-for="i in 100" :key="i" class="col-sm-2 col-md-3">
              <article class="product">
                <img>
                <p class="mt-1 w-50"></p>
              </article>
            </div>
          </div>

          <hr class="mt-5 mb-2">

          <!-- Pagination -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  section {
    /* height: 100vh; */
  }
</style>
