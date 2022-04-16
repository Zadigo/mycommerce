<template>
  <section id="cookies" class="ecommerce-section">
    <div class="container">
      <div class="row">
        <div class="col-12 py-5 border-bottom">
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

            <div class="col-4 text-center">
              <v-checkbox label="Activate" hide-details=""></v-checkbox>
            </div>
          </div>
        </div>

        <div class="col-12 py-5 border-bottom">
          <h2>Préférences</h2>
          <div class="row">
            <div class="col-8">
              <p>
                Les cookies de préférences nous permettent de mémoriser vos 
                choix et de vous reconnaître chaque fois que vous utilisez nos services.
              </p>
            </div>

            <div class="col-4">
              <v-checkbox label="Activate" hide-details=""></v-checkbox>
            </div>
          </div>
        </div>

        <div class="col-12">
          <h2>Publicité</h2>
          
          <div class="row">
            <div class="col-8">
              <p>
                Les cookies publicitaires et les autres technologies analogues 
                utilisées sur stripe.com nous permettent de placer des publicités ciblées 
                relatives à {{ myproject.company.legalName }} sur les autres sites que vous visitez, et de mesurer votre 
                activité concernant ces publicités.
              </p>
            </div>
            
            <div class="col-4">
              <v-checkbox label="Activate" hide-details=""></v-checkbox>
            </div>
          </div>
        </div>

        <div class="col-12">
          <h2>Analyse</h2>
          <p>Les cookies d'analyse nous permettent de comprendre la façon dont les visiteurs interagissent avec nos services afin d'évaluer et d'améliorer ces derniers (en association avec des outils tiers d'analyse de données).</p>
        </div>

        <div class="col-12">
          <h2>Authentification</h2>
          <p>Les cookies d'authentification permettent à {{ myproject.company.legalName }} de se souvenir de vous, afin que vous n'ayiez pas à vous identifier chaque fois que vous utilisez nos services.</p>
        </div>
        
        <div class="col-12">
          <h2>Protection contre la fraude</h2>
          <p>Les cookies de protection contre la fraude, ainsi que les technologies analogues que nous déployons sur notre site, nous permettent d'obtenir des informations sur les ordinateurs et les navigateurs Internet utilisés pour accéder aux services de Stripe. Ces informations nous permettent de surveiller et de détecter toute utilisation de nos services potentiellement malveillante ou illicite.</p>
        </div>
        
        <div class="col-12">
          <h2>Fonctionnalité</h2>
          <p>Les cookies de fonctionnalité servent à assurer le bon fonctionnement de notre site et de nos services (par exemple, à vous montrer du contenu adapté à votre localisation).</p>
        </div>

        <div class="col-12">
          <h2>Sécurité</h2>
          <p>Les cookies de sécurité nous permettent de protéger les données de nos utilisateurs contre tout accès non autorisé.</p>
        </div>

        <div class="col-12">
          <h2>Fournisseurs tiers</h2>
          <p>Nous collaborons avec des fournisseurs tiers tels que Facebook, Google et LinkedIn, qui utilisent également des cookies à des fins d'analyse et de marketing. Cette liste n'est pas forcément exhaustive, mais nous nous engageons à la mettre à jour sur la base des informations que nous communiquent de ces fournisseurs. Veuillez consulter les ressources suivantes pour en savoir plus sur les cookies utilisés par Facebook, Google et LinkedIn.</p>
        </div>
      </div>
    </div>
  </section>
</template>
