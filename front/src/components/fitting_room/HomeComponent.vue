<template>
  <div class="content">
    <p>Bienvenue dans la</p>
      <h1>Cabine d'essayage</h1>
      
      <button class="btn btn-dark btn-rounded btn-lg" @click="$emit('go-to-next')">
        Je suis prête
      </button>
  </div>
</template>

<script>
export default {
  name: 'HomeComponent'
}
</script>
