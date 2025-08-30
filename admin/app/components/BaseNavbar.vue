<template>
  <nav id="navbar" class="w-full px-5 p-2 border-b border-gray-200 z-30 bg-gray-100 absolute top-0 left-0">
    <ul class="flex space-x-4 ms-auto text-sm">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/dashboard/products">Products</router-link></li>
      <li><router-link to="/dashboard/images">Images</router-link></li>
    </ul>
  </nav>
</template>
