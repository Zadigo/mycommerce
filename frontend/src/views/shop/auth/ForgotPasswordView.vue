<template>
  <div class="card-body">
    <div class="row">
      <div class="col-12">
        <form @submit.prevent>
          <input type="email" autocomplete="email" placeholder="Email" class="form-control p-2 my-2">
        </form>
      </div>
    </div>
  </div>

  <div class="card-footer">
    <button type="button" class="btn btn-primary" @click="resetPassword">
      Reset password
    </button>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordView',
  methods: {
    resetPassword () {
    }
  }
}
</script>
