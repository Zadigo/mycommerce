<template>
  <base-intro image="/hero4.jpg">
    <intro-mask :opacity="0.5">
      <intro-container>
        <div class="container">
          <div class="row">
            <div class="col-4 offset-md-4">
              <div :title="$t('Login')" class="card" style="background-color:rgba(255, 255, 255, 0.3)">
                <slot></slot>
              </div>
              
              <slot name="additional-actions"></slot>
            </div>
          </div>
        </div>
      </intro-container>
    </intro-mask>
  </base-intro>
</template>

<script>
export default {
  name: 'BaseAuth'
}
</script>

<style scoped>
section {
  min-height: 100vh;
}
</style>
