<template>
  <ProductsFeedLayout>
    <template #filtering>
      <TailCard class="card shadow-none mb-3 border-none">
        <TailCardContent class="pt-1 pb-1 px-2 flex justify-between">
          <div class="flex justify-start gap-1">
            <TailSkeleton class="w-[100px] h-[37px] bg-gray-100" />
            <TailSkeleton class="w-[100px] h-[37px] bg-gray-100" />
            <TailSkeleton class="w-[100px] h-[37px] bg-gray-100" />
          </div>

          <div class="flex justify-content-start gap-1">
            <TailSkeleton class="w-[270px] h-[37px] bg-gray-100" />
          </div>
        </TailCardContent>
      </TailCard>
    </template>

    <template #default>
      <div class="grid grid-cols-4 gap-2">
        <div v-for="i in 40" :key="i" id="product">
          <TailSkeleton class="h-[427px] w-full bg-gray-100" />
          <TailSkeleton class="h-[15px] w-[200px] mt-1 bg-gray-100" />
          <TailSkeleton class="h-[15px] w-[100px] mt-1 bg-gray-100" />
        </div>
      </div>
    </template>
  </ProductsFeedLayout>
</template>
