<template>
  <div class="content">
    <p>Bienvenue dans la</p>
    <h1>Lounge est-il déjà incontournable un incontournable ?</h1>

    <p>Quelle est votre marque de soutien-gorge actuelle ?</p>
    
    <button class="btn btn-outline btn-lg btn-block mb-2" @click="$emit('go-to-next', true)">
      Bien sûr
    </button>

    <button class="btn btn-outline btn-lg btn-block" @click="$emit('go-to-next', false)">
      Pas encore
    </button>
  </div>
</template>

<script>
export default {
  name: 'HomeComponent'
}
</script>
