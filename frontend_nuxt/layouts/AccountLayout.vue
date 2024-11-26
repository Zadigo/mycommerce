<template>
  <section>
    <!-- Navbar -->
    <BaseNavbar />

    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-4 offset-md-2">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="list-group">
                <NuxtLink to="/account/" class="list-group-item p-3">
                  {{ $t("Mon compte") }}
                </NuxtLink>

                <NuxtLink to="/account/orders/" class="list-group-item p-3">
                  {{ $t("Mes commandes") }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-sm-12 col-md-5">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
