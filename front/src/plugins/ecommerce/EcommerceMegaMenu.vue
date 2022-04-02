<template>
  <transition name="scale-transition">
    <div ref="link" :class="{ 'show': isVisible }" class="dropdown-menu megamenu border-top" role="menu" @mouseleave="$emit('close-megamenu')">
      <div class="row g-3">
        <div v-for="section in sections" :key="section.name" class="col-6 col-lg-3">
          <div class="col-megamenu">
            <h6 class="section-title">
              {{ $t(section.name) }}
            </h6>

            <ul class="list-unstyled pl-0">
              <li v-for="(link, i) in section.links" :key="i" @click="$emit('close-megamenu')">
                <router-link :to="{ name: link.to, params: { ...link.params, lang: $i18n.locale } }">
                  {{ $t(link.name) }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
  
        <div class="col-lg-3 col-6">
          <div class="col-megamenu">
            <v-img src="http://via.placeholder.com/800x800"></v-img>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'EcommerceMegaMenu',
  props: {
    isVisible: {
      type: Boolean
    },
    sections: {
      type: Array,
      default: () => [
        {
          name: 'Trending',
          links: [
            { name: 'See all', to: 'collection_details_view', params: { collection: 'all' } },
            { name: 'Novelties', to: 'collection_details_view', params: { collection: 'novelties' } },
            { name: 'Bestsellers', to: 'collection_details_view', params: { collection: 'best-sales' } },
          ]
        },
        {
          name: 'Underwear',
          links: [
            { name: 'See all', to: 'collection_details_view', params: { collection: 'all' } },
            { name: 'Wired', to: 'collection_details_view', params: { collection: 'all' } },
            { name: 'Non wired', to: 'collection_details_view', params: { collection: 'all' } },
            { name: 'Padded', to: 'collection_details_view', params: { collection: 'all' } },
            { name: 'Non padded', to: 'collection_details_view', params: { collection: 'all' } },
            { name: 'Balcony', to: 'collection_details_view', params: { collection: 'all' } },
            { name: 'Triangle', to: 'collection_details_view', params: { collection: 'all' } },
          ]
        },
        {
          name: 'Apparel',
          links: [
            { name: 'See all', to: 'collection_details_view', params: { collection: 'all' } },
            { name: 'Leggings sets', to: 'collection_details_view', params: { collection: 'all' } },
          ]
        },
      ]
    }
  }
}
</script>

<style scoped>
@media (min-width: 992px) {
.navbar-expand-lg .navbar-nav .dropdown-menu {
    position: absolute;
    top: 100%;
    border: none;
    border-radius: 0;
    transition-property: opacity;
  }
}

@media (min-width: 992px) {
  .navbar .megamenu {
    left: 0;
    right: 0;
    width: 100%;
    margin-top: 0;
  }
}

.navbar .megamenu {
  padding: 4rem;
}

.dropdown-menu.show {
  display: block;
}

.section-title {
  /* font-family: "Montserrat"; */
  text-transform: uppercase;
  /* letter-spacing: 0.2em; */
  font-weight: 400;
  font-size: 1.1rem;
  line-height: 2.4rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #000000;
}

.list-unstyled {
    /* display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start; */
    width: 100%;
    font-size: 1rem;
    /* line-height: 2.4rem; */
    letter-spacing: 0.04em;
    font-weight: 400;
    text-transform: capitalize;
    letter-spacing: normal;
    transition-property: color;
    transition-duration: 200ms;
    transition-timing-function: 200;
}

.list-unstyled a {
  color: #7d7d7d;
  text-decoration: none;
}
</style>
