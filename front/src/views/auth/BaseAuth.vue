<template>
  <intro :image="require('@/assets/hero3.jpg')">
    <intro-mask :opacity="0.5">
      <intro-container>
        <v-container>
          <v-row>
            <v-col cols="4" class="offset-md-4">
              <b-card :title="$t('Login')" style="background-color:rgba(255, 255, 255, 0.3)">
                <slot></slot>
              </b-card>
              
              <slot name="additional-actions"></slot>
            </v-col>
          </v-row>
        </v-container>
      </intro-container>
    </intro-mask>
  </intro>
</template>

<script>
export default {
  name: 'BaseAuth',
}
</script>

<style scoped>
section {
  min-height: 100vh;
}
</style>
