<template>
  <header>
    <v-col cols="12">
      <v-card elevation="0">
        <v-card-text class="p-0">
          <v-btn text @click="$emit('previous')">
            <v-icon class="mr-2">mdi-arrow-left</v-icon>
            Previous
          </v-btn>

          <v-btn text @click="$emit('next')">
            Next
            <v-icon class="ml-2">mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card>
        <v-card-title>
          {{ title }}
        </v-card-title>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card elevation="0">
        <v-card-text class="p-0">
          <v-btn color="warning" @click="$router.go(-1)">
            <v-icon class="mr-2">mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-btn v-if="isCreate" :disabled="isSaving" class="mx-2" color="primary" @click="$emit('create')">
            <v-icon class="mr-2">mdi-save</v-icon>
            Create
          </v-btn>

          <v-btn v-else :disabled="isSaving" class="mx-2" color="primary" @click="$emit('update')">
            <v-progress-circular v-if="isSaving" indeterminate></v-progress-circular>
            <v-icon v-else class="mr-2">mdi-content-save</v-icon>
            Save and update
          </v-btn>

        </v-card-text>
      </v-card>
    </v-col>
  </header>
</template>

<script>
export default {
  name: 'BaseEditHeading',
  props: {
    isCreate: {
      type: Boolean
    },
    title: {
      type: String
    },
    isSaving: {
      type: Boolean
    }
  }
}
</script>
