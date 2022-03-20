<template>
  <section>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 d-flex justify-content-left">
          <b-skeleton width="10%" />
          <b-skeleton width="10%" class="ml-2" />
          <b-skeleton width="10%" class="ml-2" />
        </div>
        
        <div class="col-md-7">
          <div class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-6">
                  <b-skeleton-img height="600px" />
                </div>

                <div class="col-6">
                  <b-skeleton-img height="600px" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <b-skeleton width="100%" class="mt-3" />
          <b-skeleton width="50%" class="mt-3" />
          <b-skeleton width="30%" class="mt-3" />

          <div id="actions" class="d-flex justify-content-left my-5">
            <b-skeleton width="30%" />
            <b-skeleton width="30%" class="mx-2" />
            <b-skeleton width="30%" />
          </div>
          
          <b-skeleton width="100%" height="200px" class="mt-3" />
          <b-skeleton width="100%" height="200px" class="mt-3" />
        </div>

        <hr class="my-8">

        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="col-md-12">
              <div class="d-flex justify-content-between mt-4 mb-2 ">
                <h4 class="text-uppercase font-weight-bold">
                  {{ $t('You may also like') }}
                </h4>
                <b-skeleton width="10%" height="5%" type=" text" animation="fade"></b-skeleton>
              </div>
            </div>

            <div class="col-md-12">
              <v-row>
                <v-col v-for="i in 4" :key="i" cols="3">
                  <b-skeleton height="404px" type="image" animation="fade"></b-skeleton>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProductSkeleton'
}
</script>
