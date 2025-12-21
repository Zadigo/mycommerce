<template>
  <footer class="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-primary-500 bg-white border-t border-primary-50 pt-10">
    <div :class="`grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${numberOfSections + 1}`">
      <div class="sm:col-span-2 lg:col-span-1">
        <nuxt-link-locale id="link-home-footer" to="/" class="font-bold font-title text-3xl mb-6">
          {{ getKey('legalName') }}
        </nuxt-link-locale>

        <p class="text-sm/7 mt-6">
          {{ getKey('legalName') }} is a free and open-source UI component library with over 300+ beautifully
          crafted, customizable components built with Tailwind CSS.
        </p>

        <a v-for="item in socialLinks" :key="item.name" :href="item.url" class="opacity-80 transition-opacity hover:opacity-100">
          <icon :name="`fa-brands:${item.icon}`" />
        </a>

        <client-only>
          <template #default>
            <a href="#" @click.prevent="showLanguageModal = true">{{ i18nCountry }}|{{ languageChoice }}</a>
          </template>
          
          <template #placeholder>
            <volt-skeleton class="w-24 h-6 mt-4" />
          </template>

          <template #fallback>
            <span>France</span>
          </template>
        </client-only>
      </div>

      <div v-for="(section, x) in footerLinks.sections" :key="section.name" class="flex flex-col lg:items-center lg:justify-start">
        <div class="flex flex-col text-sm space-y-2.5">
          <h2 class="font-semibold mb-5 text-primary-800">{{ $t(section.name) }}</h2>
          
          <nuxt-link-locale v-for="(item, y) in section.links" :key="item.name" :to="item.to" class="hover:text-slate-600 transition">
            {{ $t(item.name) }}
          </nuxt-link-locale>
        </div>
      </div>
    </div>

    <client-only>
      <p class="py-4 text-center border-t mt-6 border-slate-200">
        Copyright {{ currentYear }} © <nuxt-link-locale to="/">{{ getKey('legalName') }}</nuxt-link-locale> All Right Reserved.
      </p>
    </client-only>
  </footer>
</template>

<script lang="ts" setup>
import { socialLinks, footerLinks, useBusinessDetails } from '~/data'
import type { BaseCountries } from '~/types'

const i18nCountry = useCookie<BaseCountries>('i18nCountry')

const { $dayjs } = useNuxtApp()
const { writeableSession } = useSession()
const { getKey } = await useBusinessDetails()

const emit = defineEmits<{ 'show-whatsapp': [] }>()

const numberOfSections = computed(() => footerLinks.sections.length)
const languageChoice = computed(() => isDefined(writeableSession) ? writeableSession.value.language.choice : 'fr')
const currentYear = computed(() => $dayjs().year())

const showLanguageModal = useState<boolean>('showLanguageModal')
</script>
