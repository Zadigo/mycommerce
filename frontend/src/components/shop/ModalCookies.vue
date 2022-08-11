<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h4>Bienvenue à Lounge!</h4>

        <p>
          Pour vous offrir la meilleure expérience possible, nous utilisons des cookies.
          Si vous cliquez sur "J'accepte", vous acceptez que des cookies soient stockés sur votre
          appareil afin d’améliorer la navigation sur le site, d’analyser l’utilisation du site et
          de contribuer à nos efforts de marketing. Pour obtenir plus d’informations ou modifier vos
          préférences, cliquez sur le bouton “Gestion des cookies”.
        </p>

        <div class="d-flex justify-content-between">
          <router-link :to="{ name: 'cookies_view', params: { lang: $i18n.locale } }" class="btn-link">
            {{ $t('Gestion des cookies') }}
          </router-link>

          <router-link :to="{ name: 'cookies_view', params: { lang: $i18n.locale } }" class="btn-link">
            {{ $t("J'accepte") }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
