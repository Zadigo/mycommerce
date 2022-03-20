<template>
  <section id="size-guide">
    <page-header />

    <v-container>
      <v-row>
        <v-col cols="9" offset-md="2">
          <h4 class="text-uppercase h5">{{ $t('Select an option') }}</h4> 
        </v-col>

        <v-col cols="9" offset-md="2">
          <hr>

          <h4 class="text-uppercase h5">Soutien-Gorge à armature</h4>
          
          <p class="text-muted">
            Nos soutiens-gorge à armatures sont conçus pour épouser vos courbes avec confort et maintien. Des styles en dentelle et des luxes soyeux à nos soutiens-gorge t-shirt classiques - tout le monde y trouvera son bonheur avec notre collection de soutiens-gorge à armatures.
          </p>

          <p class="text-muted">
            Nous proposons actuellement des tailles de bonnet allant de A à G. Veuillez noter qu'une poignée de nos ensembles ne correspondent pas à notre plus grande taille de bonnet, mais nous nous efforçons d'élargir notre offre le plus rapidement possible afin que tout le monde puisse profiter d’un moment de détente !
          </p>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import PageHeader from '../components/products/PageHeader.vue'

export default {
  name: 'SizeGuideView',
  components: { PageHeader}
}
</script>
