<template>
  <div :class="theme.listGroup">
    <div v-for="item in items" :key="item.label" active :class="theme.listGroupItem" @click="item.action ? item.action(item) : null">
      <slot name="item" :item="item">
        <div class="space-x-3 flex items-center">
          <Icon v-if="item.icon" :name="item.icon" />
          <span>{{ item.label }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface OptionalProps {
  icon: string
  active: boolean
  action: (item: ListGroupProps) => void
}

interface ListGroupProps extends Partial<OptionalProps> {
  label: string
}

interface Props {
  items: ListGroupProps[],
  variant?: 'default' | 'flush' | 'flat'
}

const { items, variant = 'default' } = defineProps<Props>()

const theme = ref({
  listGroup: [
    `rounded-md bg-white w-full group`,
    {
      'shadow-md': variant === 'default',
      'shadow-none': variant === 'flush' || variant === 'flat',
      'border border-slate-200 *:not-last:border-b *:not-last:border-b-slate-100': variant === 'flush'
    }
  ],
  listGroupItem: [
    `text-black font-light normal-case text-left py-4 px-5 cursor-pointer hover:bg-slate-50
     first:hover:rounded-tl-md first:hover:rounded-tr-md 
     last:hover:rounded-bl-md last:hover:rounded-br-md
     not:last:border-b-1 not:last:border-slate-50`
  ]
})
</script>
