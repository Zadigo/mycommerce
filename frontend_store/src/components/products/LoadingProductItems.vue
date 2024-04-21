<template>
  <div class="row gx-1 gy-1">
    <div v-for="i in 40" :key="i" class="card" aria-hidden="true">
      <img src="..." class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title placeholder-glow">
          <span class="placeholder col-6"></span>
        </h5>
        <p class="card-text placeholder-glow">
          <span class="placeholder col-7"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-6"></span>
          <span class="placeholder col-8"></span>
        </p>
        <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
      </div>
    </div>
  </div>
</template>
