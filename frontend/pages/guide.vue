<template>
  <div class="container" style="margin-top: 59px;">
    <div class="row">
      <div class="col-sm-12 col-md-6 offset-md-3">
        <article v-for="(item, i) in guideText" :id="item.id" :key="i" class="card shadow-sm mb-2">
          <div class="card-body">
            <h4 class="card-title">{{ item.title }}</h4>

            <!-- TODO: Create components -->
            <template v-for="(content, x) in item.text" :key="x">
              <template v-if="content.type === 'text'">
                <h5 v-if="content.title">{{ content.title }}</h5>
                <p v-if="typeof content.content === 'string'">{{ content.content }}</p>
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
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { guideText } from '~/data'
</script>
