<template>
  <div class="app">
    <HeaderBlock />
  </div>
</template>

<script setup>
import HeaderBlock from './components/HeaderBlock.vue'
</script>
<style lang="scss">
html {
  background: black;
}


.app {
  padding: 24px;
  width: 100%;
  height: 100vh;
  max-width: 1440px;
  margin: 0 auto;
  background: green;
}
</style>
