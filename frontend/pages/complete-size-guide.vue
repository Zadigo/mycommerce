<template>
  <section id="complete-size-guide" class="mx-auto px-10">
    <TailTabs default-value="account" class="w-[400px]">
      <TailTabsList>
        <TailTabsTrigger value="account">
          Account
        </TailTabsTrigger>

        <TailTabsTrigger value="password">
          Password
        </TailTabsTrigger>
      </TailTabsList>
      
      <TailTabsContent value="account">
        Make changes to your account here.
      </TailTabsContent>

      <TailTabsContent value="password">
        Change your password here.
      </TailTabsContent>
    </TailTabs>
  </section>
</template>

<script setup lang="ts">
import '~/assets/css/main.css'
</script>
