<template>
  <div class="card-body">
    <div class="col-12">
      <form @submit.prevent>
        <div class="row my-4">
          <div class="col-12 text-center">
            <div class="box">
              <input v-model="verificationCredentials.verification_code" class="entry form-control border text-center" autocomplete="off" type="text" maxlength="4">
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="card-footer">
    <button type="button" class="btn btn-primary" @click="verify">
      Verify account
    </button>
  </div>
</template>

<script>
import useAuthenticationComposable from '@/composables/authentication'

export default {
  name: 'VerifyAccountView',
  setup () {
    const { performAccountVerification, verificationCredentials } = useAuthenticationComposable()
    return {
      verificationCredentials,
      performAccountVerification
    }
  },
  methods: {
    async verify () {
      this.performAccountVerification(() => {
        this.$router.push({ name: 'login_view' })
      }, (error) => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
.box {
  display: inline-block;
  position: relative;
  width: 396px;
  height: 150px;
}

.box .entry {
  position: absolute;
  /* padding-left: 21px; */
  font-size: 47px;
  height: 100%;
  letter-spacing: 47px;
  background-color: transparent;
  border: 0;
  outline: none;
}
</style>
