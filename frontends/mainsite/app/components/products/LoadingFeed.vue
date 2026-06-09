<template>
  <products-feed-layout>
    <template #filtering>
      <volt-card class="shadow-none mb-3 border-none">
        <template #content>
          <div class="pt-1 pb-1 px-2 flex justify-between">
            <div class="flex justify-start gap-1">
              <volt-skeleton height="37px" width="100px" class="bg-gray-100" />
              <volt-skeleton height="37px" width="100px" class="bg-gray-100" />
              <volt-skeleton height="37px" width="100px" class="bg-gray-100" />
            </div>

            <div class="flex justify-content-start gap-1">
              <volt-skeleton height="37px" width="270px" class="bg-gray-100" />
            </div>
          </div>
        </template>
      </volt-card>
    </template>

    <template #default>
      <div class="grid grid-cols-4 gap-2">
        <products-loading-cards :quantity="40" />
      </div>
    </template>
  </products-feed-layout>
</template>
