<template>
  <section id="account" class="ecommerce-section">
    <div class="container">
      <div class="row">
        <div class="col-10 offset-md-1">
          <h2>{{ $t('my_account') }}</h2>

          <router-view />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BaseAccount',
  title() {
    return 'Account'
  }
}
</script>

<style scoped>
section {
  margin-top: 8rem;
  min-height: 400px;
  height: auto;
}
</style>
