<template>
  <section id="size-guide" class="my-5">
    <BaseJumbotronVue>
      <template #default>
        <img class="d-block mx-auto mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57">
        
        <h1 class="display-5 fw-bold">Centered hero</h1>
        
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">
            Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most
            popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system,
            extensive prebuilt components, and powerful JavaScript plugins.
          </p>
          
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Primary button</button>
            <button type="button" class="btn btn-outline-secondary btn-lg px-4">Secondary</button>
          </div>
        </div>
      </template>
    </BaseJumbotronVue>

    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-9 offset-md-2">
          <h4 class="text-uppercase h5">
            {{ $t('Select an option') }}
          </h4>
        </div>

        <div class="col-sm-12 col-md-9 offset-md-2">
          <hr>

          <h4 class="text-uppercase h5">
            Soutien-Gorge à armature
          </h4>

          <p class="text-muted">
            Nos soutiens-gorge à armatures sont conçus pour épouser vos courbes avec confort et maintien. Des styles en
            dentelle et des luxes soyeux à nos soutiens-gorge t-shirt classiques - tout le monde y trouvera son bonheur
            avec notre collection de soutiens-gorge à armatures.
          </p>

          <p class="text-muted">
            Nous proposons actuellement des tailles de bonnet allant de A à G. Veuillez noter qu'une poignée de nos
            ensembles ne correspondent pas à notre plus grande taille de bonnet, mais nous nous efforçons d'élargir
            notre offre le plus rapidement possible afin que tout le monde puisse profiter d’un moment de détente !
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseJumbotronVue from '../../layouts/BaseJumbotron.vue'

export default {
  name: 'SizeGuideView',
  components: {
    BaseJumbotronVue
  }
}
</script>
