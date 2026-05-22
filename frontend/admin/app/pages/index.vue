<template>
  <nuxt-container>
    <div class="max-w-lg mx-auto">
      <div class="flex justify-center items-center my-20">
        <nuxt-card>
          <template #header>
            Se connecter
          </template>
          
          <div class="space-y-2">
            <nuxt-input v-model="email" class="w-full" label="Email" type="email" outlined />
            <nuxt-input v-model="password" class="w-full" label="Mot de passe" type="password" outlined />
          </div>
  
          <template #footer>
            <nuxt-button>
              Se connecter
            </nuxt-button>
          </template>
        </nuxt-card>
      </div>
    </div>
  </nuxt-container>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Login',
  // redirect() {
  //   const user = false

  //   if (user) {
  //     return navigateTo('/dashboard')
  //   }
  // }
})

const email = ref<string>('')
const password = ref<string>('')

onMounted(() => { document.body.classList.add('bg-slate-50') })
onUnmounted(() => { document.body.classList.remove('bg-slate-50') })
</script>
