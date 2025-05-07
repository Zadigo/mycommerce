<template>
  <TailNavigationMenu>
    <TailNavigationMenuList>
      <TailNavigationMenuItem>
        <NuxtLinkLocale v-slot="{ isActive, href, navigate }" to="/shop/collection/novelties" custom>
          <TailNavigationMenuLink :active="isActive" :href="href" :class="navigationMenuTriggerStyle()" @click="navigate">
            Nouvelle collection
          </TailNavigationMenuLink>
        </NuxtLinkLocale>
      </TailNavigationMenuItem>
      
      <TailNavigationMenuItem>
        <TailNavigationMenuTrigger>
          Getting started
        </TailNavigationMenuTrigger>

        <TailNavigationMenuContent>
          <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
            <li class="row-span-3">
              <TailNavigationMenuLink as-child>
                <NuxtLink class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" to="/">
                  <img src="https://www.reka-ui.com/logo.svg" class="h-6 w-6">
                  <div class="mb-2 mt-4 text-lg font-medium">
                    shadcn/ui
                  </div>
                  <p class="text-sm leading-tight text-muted-foreground">
                    Beautifully designed components built with Radix UI and
                    Tailwind CSS.
                  </p>
                </NuxtLink>
              </TailNavigationMenuLink>
            </li>
          </ul>
        </TailNavigationMenuContent>
      </TailNavigationMenuItem>

      <TailNavigationMenuItem>
        <TailNavigationMenuTrigger>
          {{ $t('Collections') }}
        </TailNavigationMenuTrigger>
        
        <TailNavigationMenuContent>
          <ul class="grid w-[400px] gap-3 pa-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
            <li v-for="component in components" :key="component.title">
              <TailNavigationMenuLink as-child>
                <a :href="component.href" class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{ component.description }}
                  </p>
                </a>
              </TailNavigationMenuLink>
            </li>
          </ul>
        </TailNavigationMenuContent>
      </TailNavigationMenuItem>
    </TailNavigationMenuList>
  </TailNavigationMenu>
</template>

<script setup lang="ts">
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

const components: { title: string, href: string, description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/components/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/components/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/components/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/components/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/components/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/components/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]
</script>
