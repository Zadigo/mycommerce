<template>
  <section id="collection" class="ecommerce-section">
    <div class="container-fluid">
      <div class="row">

        <div class="col-12">
          <!-- Filters -->
          <b-skeleton width="100%" height="50%" type="text" animation="fade"></b-skeleton>
          
          <!-- Statistics -->
          <b-skeleton width="20%" height="30%" type="text" animation="fade" class="text-center text-muted m-0 mt-5"></b-skeleton>
        </div>

        <div class="col-12">
          <div class="row">
            <div v-for="i in 100" :key="i" class="col-3">
              <b-skeleton-img height="400px" animation="fade"></b-skeleton-img>

              <div id="product-details" class="mt-2">
                <b-skeleton width="50%" height="10%" animation="fade"></b-skeleton>
                <b-skeleton width="40%" height="10%" type="text" animation="fade"></b-skeleton>
              </div>
            </div>
          </div>
        </div>
        
        <hr>

        <!-- Pagination --> 
        <b-skeleton width="40%" type="text" animation="fade"></b-skeleton>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProductsSkeleton'
}
</script>
