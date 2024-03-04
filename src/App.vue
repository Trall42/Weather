<template>
  <div id="app" class="app">
    <RootBlock />
  </div>
</template>

<script setup>
import RootBlock from './components/RootBlock.vue'
</script>
<style lang="scss">
html {
  background: $white !important;
}
.app {
  width: 100%;
  height: 100vh;
  background-image: url('/src/assets/img/cities/city-1.png');
  background-repeat: no-repeat;
  background-size: cover;
}
@media(min-width: 768px) {
  .app {
    background-image: url('/src/assets/img/weather_wallpaper/summer.webp');
  }
}
</style>