<template>
  <div class="box">
    <v-img v-for="i in 15" :key="i" :src="'http://via.placeholder.com/800x1100'"></v-img>
  </div>
</template>


<style scoped>
.box {
  /* position: absolute;
  top: 50%;
  left: 50%; */
  width: 300px;
  overflow: hidden;
  /* transform: translate(-50%, -50%) */
}

.box img {
  object-fit: cover;
}
</style>
