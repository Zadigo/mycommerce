<template>
  <section id="images">
    <v-row>
      <v-col cols="8">
        <v-img src="http://via.placeholder.com/800x1200"></v-img>
      </v-col>

      <v-col cols="4">
        <v-card>
          <v-card-title>
            Image title  
          </v-card-title>

          <v-card-text>
            <v-text-field type="text" accept="image/jpg, image/jpeg" label="Name" outlined hide-details show-size></v-text-field>

          </v-card-text>

          <v-card-actions>
            <v-btn text>Save</v-btn>
            <v-btn text>Delete</v-btn>  
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </section>
</template>

<script>
export default {
  name: 'ProductImageView'
}
</script>
