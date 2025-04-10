<template>
  <div class="my-10">
    <div class="mx-auto w-2/3">
      <TailCard v-for="(item, i) in guideText" :id="item.id" :key="i" class="border-none shadow-sm mb-2">
        <TailCardContent>
          <h4 class="font-bold font-2xl mb-2">
            {{ item.title }}
          </h4>

          <!-- TODO: Create components -->
          <template v-for="(content, x) in item.text" :key="x">
            <template v-if="content.type === 'text'">
              <h5 v-if="content.title" class="font-bold font-1xl mb-2">{{ content.title }}</h5>
              <p v-if="typeof content.content === 'string'" class="mb-2">{{ content.content }}</p>
            </template>

            <template v-else-if="content.type === 'points'">
              <h5 v-if="content.title">{{ content.title }}</h5>
              <template v-for="(value, y) in content.content" :key="y">
                <ul v-if="typeof value === 'object'">
                  <li v-for="(text, z) in value" :key="z">
                    {{ text }}
                  </li>
                </ul>
                <p v-else>{{ value }}</p>
              </template>
            </template>
          </template>
        </TailCardContent>
      </TailCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { guideText } from '~/data'
</script>
