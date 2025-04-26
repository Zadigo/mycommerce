<template>
  <div class="mx-auto px-10 my-10">
    <TailButton variant="outline" class="">
      Test
    </TailButton>

    <div class="mx-auto px-5">
      <TailFooter variant="light">
        <TailFooterContent>
          <TailFooterSection>
            <TailFooterSectionLinks v-for="i in 3" :key="i" title="Some title">
              <TailFooterSectionLink to="/">Link 1</TailFooterSectionLink>
              <TailFooterSectionLink to="/">Link 2</TailFooterSectionLink>
            </TailFooterSectionLinks>
          </TailFooterSection>

          <TailFooterSocials>
            <template #coopywrite>Copwrite</template>
            <template #socials>Socials</template>
          </TailFooterSocials>
        </TailFooterContent>
      </TailFooter>
    </div>
  </div>
</template>
