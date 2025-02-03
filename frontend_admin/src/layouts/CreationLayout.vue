<template>
  <q-page padding>
    <div class="row">
      <div class="col-10 offset-1">
        <slot name="pageHeader" />

        <div class="row">
          <div class="col-8 q-pr-sm">
            <slot />
          </div>

          <aside class="col-4">
            <slot name="pageAside" />
          </aside>
        </div>
      </div>
    </div>
  </q-page>
</template>
