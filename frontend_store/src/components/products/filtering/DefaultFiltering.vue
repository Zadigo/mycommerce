<template>
  <div class="card shadow-none mb-3">
    <div class="card-body px-0">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-left gap-1">
          <v-btn flat>
            Trier
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />

            <v-menu activator="parent">
              <v-list>
                <v-list-item v-for="(item, i) in sortingOptions" :key="i" :value="item">
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>

          <v-btn flat>
            Taille
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />

            <v-menu activator="parent">
              <v-list style="width: 400px;">
                <v-list-item>
                  <p class="text-tertiary">Tailles standard</p>
                  <v-btn variant="outlined">S</v-btn>
                  <v-btn variant="outlined">XS</v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>

          <!-- <button type="button" class="btn btn-sm btn-light shadow-none">
            Trier
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button> -->
          <!-- <button type="button" class="btn btn-sm btn-light shadow-none">
            Taille
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button> -->
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Couleurs
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Matières
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Prix
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Formes
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Armatures
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Coques
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
        </div>


        <div class="d-flex justify-content-right gap-1 align-items-center">
          <span id="product-count" class="fw-bold me-2">92 produits trouvés</span>
          <!-- <button class="btn btn-sm btn-light shadow-none">
            <font-awesome-icon :key="i" :icon="['fas', 'table-cells']" />
          </button> -->
          <button type="button" class="btn btn-sm btn-light shadow-none" @click="handleGridSize(3)">
            <font-awesome-icon :icon="['fas', 'table-cells-large']" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none" @click="handleGridSize(4)">
            <font-awesome-icon :icon="['fas', 'table-cells']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

const sortingOptions = [
  'Prix croissant'
]

export default {
  emits: {
    'update-grid-size' () {
      return true
    }
  },
  setup () {
    const gridSize = ref(4)
    return {
      gridSize,
      sortingOptions
    }
  },
  methods: {
    handleGridSize (size) {
      this.gridSize = size
      this.$emit('update-grid-size', size)
    }
  }
}
</script>

<style scoped>
  #product-count {
    font-size: .9rem;
  }
</style>
