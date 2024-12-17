<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page>
        <div class="row">
          <div class="col-4 offset-4">
            <div refs="alertEl" class="q-pa-lg">
              Could not find account
            </div>

            <q-card>
              <q-card-section>
                <q-form>
                  <q-input v-model="requestData.username" type="email" placeholder="Email" standout />
                  <q-input v-model="requestData.password" type="password" placeholder="Password" standout />
                  <q-btn @click="requestLogin">Login</q-btn>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import axios, { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { LoginAPIResponse } from './login'
import { getCssVar } from 'quasar'

const requestData = ref({
  username: '',
  password: ''
})

const alertEl = ref<HTMLElement>()

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000/auth/v1/',
  headers: { 'Content-Type': 'application/json' }
})

onMounted(() => {
  const val = getCssVar('primary', alertEl.value)
  if (alertEl.value) {
    if (typeof alertEl.value === 'string') {
      alertEl.value.style.backgroundColor = val
    }
  }
})

async function requestLogin () {
  try {
    const response = await client.post<LoginAPIResponse>('/token/', requestData.value)
    console.log(response.data)
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Do something
    }
  }
}
</script>
