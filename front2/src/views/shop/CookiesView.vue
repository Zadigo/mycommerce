<template>
  <section id="cookies" class="ecommerce-section">
    <div class="container">
      <div class="row">
        <div class="card shadow-none">
          <div class="card-body">
            <div id="cookie-parameters" class="col-12 py-5 border-bottom" aria-label="Paramètres de cookies">
              <h2>Paramètres des cookies</h2>

              <div class="row">
                <div class="col-8">
                  <p>
                    {{ myproject.company.legalName }} utilise des cookies à des fins de marketing et d'amélioration de
                    l'expérience client. Consultez et gérez vos paramètres ci-dessous pour garder
                    la main sur la protection de votre vie privée. Pour en savoir plus, consultez la
                    politique de {{ myproject.company.legalName }} sur l'utilisation des cookies.
                  </p>
                </div>

                <div class="col-4">
                  <div class="form-check">
                    <input id="parameters" v-model="cookies.parameters" class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>
            </div>

            <div id="cookie-preferences" class="col-12 py-5 border-bottom" aria-label="Préférences">
              <h2>Préférences</h2>
              <div class="row">
                <div class="col-8">
                  <p>
                    Les cookies de préférences nous permettent de mémoriser vos
                    choix et de vous reconnaître chaque fois que vous utilisez nos services.
                  </p>
                </div>

                <div class="col-4">
                  <div class="form-check">
                    <input id="preferences" v-model="cookies.preferences" class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>
            </div>

            <div id="advertising" class="col-12 py-5 border-bottom" aria-label="Publicité">
              <h2>Publicité</h2>

              <div class="row">
                <div class="col-8">
                  <p>
                    Les cookies publicitaires et les autres technologies analogues
                    utilisées sur stripe.com nous permettent de placer des publicités ciblées
                    relatives à {{ myproject.company.legalName }} sur les autres sites que vous visitez, et de mesurer
                    votre
                    activité concernant ces publicités.
                  </p>
                </div>

                <div class="col-4">
                  <div class="form-check">
                    <input id="advertising" v-model="cookies.advertising" class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>
            </div>

            <div id="analysis" class="col-12 py-5 border-bottom" aria-label="Analyse">
              <h2>Analyse</h2>

              <p>Les cookies d'analyse nous permettent de comprendre la façon dont les visiteurs interagissent avec nos
                services afin d'évaluer et d'améliorer ces derniers (en association avec des outils tiers d'analyse de
                données).</p>
            </div>

            <div id="authentification" class="col-12 py-5 border-bottom" aria-label="Authentification">
              <h2>Authentification</h2>

              <p>Les cookies d'authentification permettent à {{ myproject.company.legalName }} de se souvenir de vous,
                afin que vous n'ayiez pas à vous identifier chaque fois que vous utilisez nos services.</p>
            </div>

            <div id="fraude" class="col-12 py-5 border-bottom" aria-label="Protection contre la fraude">
              <h2>Protection contre la fraude</h2>

              <p>Les cookies de protection contre la fraude, ainsi que les technologies analogues que nous déployons sur
                notre site, nous permettent d'obtenir des informations sur les ordinateurs et les navigateurs Internet
                utilisés pour accéder aux services de Stripe. Ces informations nous permettent de surveiller et de
                détecter toute utilisation de nos services potentiellement malveillante ou illicite.</p>
            </div>

            <div id="functionnalities" class="col-12 py-5 border-bottom" aria-label="Fonctionnalité">
              <h2>Fonctionnalité</h2>
              <p>Les cookies de fonctionnalité servent à assurer le bon fonctionnement de notre site et de nos services
                (par exemple, à vous montrer du contenu adapté à votre localisation).</p>
            </div>

            <div id="security" class="col-12 py-5 border-bottom" aria-label="Sécurité">
              <h2>Sécurité</h2>
              <p>Les cookies de sécurité nous permettent de protéger les données de nos utilisateurs contre tout accès
                non autorisé.</p>
            </div>

            <div id="providers" class="col-12 py-5" aria-label="Fournisseurs tiers">
              <h2>Fournisseurs tiers</h2>
              <p>Nous collaborons avec des fournisseurs tiers tels que Facebook, Google et LinkedIn, qui utilisent
                également des cookies à des fins d'analyse et de marketing. Cette liste n'est pas forcément exhaustive,
                mais nous nous engageons à la mettre à jour sur la base des informations que nous communiquent de ces
                fournisseurs. Veuillez consulter les ressources suivantes pour en savoir plus sur les cookies utilisés
                par Facebook, Google et LinkedIn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CookiesView',
  data: () => ({
    cookies: {
      parameters: true,
      preferences: true,
      advertising: true
    }
  }),
  watch: {
    cookies (current) {
      this.$localstorage.create('cookies', current)
    }
  },
  beforeMount () {
    if (!Object.getOwnPropertyDescriptor(this.localStorage, 'cookies')) {
      this.$localstorage.create('cookies', this.cookies)
    } else {
      this.cookies = this.localStorage.cookies
    }
  }
}
</script>
