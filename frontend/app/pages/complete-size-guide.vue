<template>
  <section id="complete-size-guide" class="mx-auto px-10">
    <tail-tabs default-value="account" class="w-[400px]">
      <tail-tabs-list>
        <tail-tabs-trigger value="account">
          Account
        </tail-tabs-trigger>

        <tail-tabs-trigger value="password">
          Password
        </tail-tabs-trigger>
      </tail-tabs-list>
      
      <tail-tabs-content value="account">
        Make changes to your account here.
      </tail-tabs-content>

      <tail-tabs-content value="password">
        Change your password here.
      </tail-tabs-content>
    </tail-tabs>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t("Guide de taille complet"),
  titleTemplate: '%s | E-Woman'
})
</script>
