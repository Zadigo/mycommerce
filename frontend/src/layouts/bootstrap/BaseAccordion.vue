<template>
  <div :id="'accordionExample'" ref="link" :class="{'border-dark': darkMode}" class="accordion">
    <div v-for="(item, i) in items" :key="i" class="accordion-item">
      <h2 id="headingOne" class="accordion-header">
        <button :class="{ collapsed: !isSelected(i), 'bg-dark text-light': darkMode}" :aria-expanded="isSelected(i)" :aria-controls="`collapse-${i}`" class="accordion-button" type="button" @click="selectItem($event, i)">
          {{ item.title }}
        </button>
      </h2>
      <!-- v-if="isSelected(i)" -->
      <div :id="`collapse-${i}`" :class="{show: isSelected(i), 'bg-dark text-light': darkMode}" class="accordion-collapse collapse" aria-labelledby="headingOne">
        <div class="accordion-body">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, inject } from 'vue'
import { useLists } from './composables/index'

export default {
  name: 'BaseAccordion',
  props: {
    items: {
      type: Array
    }
  },
  emits: {
    click () {
      return true
    }
  },
  setup () {
    const target = null
    const app = getCurrentInstance()

    // function collapsing (e) {
    //   const id = e.target.attributes.getNamedItem('id').value
    //   const collapse = target.querySelector(`#${id}`)
    //   collapse.classList.remove('collapse')
    //   collapse.classList.add('collapsing')
    //   setTimeout(() => {
    //     collapse.classList.remove('collapsing')
    //     collapse.classList.add('collapse')
    //   }, 1000);
    // }

    const { selectItem, selectedIds, selected, isSelected } = useLists(app.props.items)
    const darkMode = inject('darkMode', false)
    return {
      target,
      darkMode,
      isSelected,
      selectItem,
      selectedIds,
      selected
    }
  },
  mounted () {
    this.target = this.$refs.link
  }
  // data () {
  //   return {
  //     computedItems: []
  //   }
  // },
  // beforeMount () {
  //   this.computedItems = this.items.map((item) => {
  //     item.show = false
  //     return item
  //   })
  // },
  // methods: {
  //   expandItem (item) {
  //     item.show = !item.show
  //     this.$emit('click', item)
  //   }
  // }
}
</script>

<style scoped>
.border-dark {
  border-color: #373b3e;
}
</style>
