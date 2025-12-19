<template>
  <footer class="relative w-full md-5 mt-5 md:mt-10 border-t border-gray-50">
    <div class="mx-auto w-full max-w-7xl p-10">
      <div class="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
        <nuxt-link-locale id="link-home-footer" to="/" class="font-bold font-title text-3xl mb-6">
          Material Tailwind
        </nuxt-link-locale >

        <div :class="`grid grid-cols-${numberOfSections}`" class="justify-between gap-4">
          <ul v-for="(section, x) in footerLinks.sections" :key="section.name">
            <h5 class="mb-3 font-bold opacity-90 ">
              {{ $t(section.name) }}
            </h5>
            
            <li v-for="(item, y) in section.links" :key="item.name">
              <nuxt-link-locale :id="`link-footer-${x}-${y}`" :to="item.to" class="py-1.5 font-normal transition-colors hover:text-blue-gray-900">
                {{ $t(item.name) }}
              </nuxt-link-locale >
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
        <div class="mb-4 text-center font-normal text-blue-gray-900 md:mb-0">
          <client-only>
            &copy; {{ currentYear }} <a href="#" @click.prevent="showLanguageModal=true">{{ languageLocation }}|{{ languageChoice }}</a> <nuxt-link-locale  to="/">Material Tailwind</nuxt-link-locale >. All Rights Reserved.
          </client-only>
        </div>

        <div class="flex gap-4 text-blue-gray-900 sm:justify-center">
          <a v-for="item in socialLinks" :key="item.name" :href="item.url" class="opacity-80 transition-opacity hover:opacity-100">
            <Icon :name="`fa-brands:${item.icon}`" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { socialLinks, footerLinks } from '~/data'

const { $dayjs } = useNuxtApp()
const { session } = await useSession()

const emit = defineEmits<{ 'show-whatsapp': [] }>()

const numberOfSections = computed(() => footerLinks.sections.length)
const languageLocation = computed(() => isDefined(session) ? session.value.language.location : 'France')
const languageChoice = computed(() => isDefined(session) ? session.value.language.choice : 'fr')
const currentYear = computed(() => $dayjs().year())

const showLanguageModal = useState<boolean>('showLanguageModal')

// Hydration errors: 
// https://www.lichter.io/articles/vue-hydration-error/
// https://stackoverflow.com/questions/47862591/vuejs-error-the-client-side-rendered-virtual-dom-tree-is-not-matching-server-re/67978474#67978474
// https://stackoverflow.com/questions/78552115/hydration-completed-but-contains-mismatches-using-veevalidate-and-pinia-in-nuxt
</script>
