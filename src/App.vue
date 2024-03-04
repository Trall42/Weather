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
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-image: url('/src/assets/img/cities/city-1.png');
  background-repeat: no-repeat;
  background-size: cover;
  overflow-y: auto;
}
@media(min-width: 768px) {
  .app {
    justify-content: center;
    background-image: url('/src/assets/img/weather_wallpaper/summer.webp');
  }
}
</style>