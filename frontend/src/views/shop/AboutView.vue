<template>
  <section id="about-us" class="ecommerce-section">
    <div class="container">
      <div class="col-sm-12 col-md-9 offset-md-1">
        <div class="row">
          <!-- Breadbumbs -->
          <div class="col-12">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'shop_view', params: { lang: $i18n.locale } }" class="text-muted">{{
                    $t('Home') }}
                  </router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  {{ $t('About us') }}
                </li>
              </ol>
            </nav>
          </div>

          <div class="col-12">
            <div class="card">
              <div class="card-body">
                SHEIN est un détaillant électronique mondial de mode et de style de vie qui s'engage à rendre la beauté
                de
                la mode accessible à tous. Nous utilisons une technologie de fabrication à la demande pour connecter les
                fournisseurs à notre chaîne d'approvisionnement agile, réduisant ainsi le gaspillage des stocks et nous
                permettant de livrer une variété de produits abordables aux clients du monde entier. Depuis nos bureaux
                internationaux, nous touchons des clients dans plus de 150 pays. Pour en savoir plus sur SHEIN, visitez
                le
                site fr.SHEIN.com.
              </div>
            </div>
          </div>

          <div class="col-7 my-3">
            <div class="card shadow-none">
              <div class="card-body">
                <h3 class="fw-bold">TOUT A COMMENCÉ DANS LE SALON...</h3>
                <p>
                  Depuis son lancement en 2016 dans le salon de nos co-fondateurs, Lounge a connu un incroyable voyage.
                  Notre
                  mission consiste à donner du pouvoir aux femmes du monde entier, à redéfinir les normes de beauté et à
                  ouvrir la voie à tout ce qui est Comfort Made Sexy.

                  Et croyez-nous quand nous disons que nous ne faisons que commencer...
                </p>
              </div>
            </div>

            <div class="card shadow-none">
              <div class="card-body">
                <h3 class="fw-bold">TOUT A COMMENCÉ DANS LE SALON...</h3>
                <p>
                  Depuis son lancement en 2016 dans le salon de nos co-fondateurs, Lounge a connu un incroyable voyage.
                  Notre
                  mission consiste à donner du pouvoir aux femmes du monde entier, à redéfinir les normes de beauté et à
                  ouvrir la voie à tout ce qui est Comfort Made Sexy.

                  Et croyez-nous quand nous disons que nous ne faisons que commencer...
                </p>
              </div>
            </div>
          </div>

          <div class="col-5">
            <div class="card my-3">
              <img src="http://via.placeholder.com/500x600" class="card-img-top" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
