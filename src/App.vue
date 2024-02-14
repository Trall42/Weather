<template>
  <div class="app">
    <RootBlock />
  </div>
</template>

<script setup>
import RootBlock from './components/RootBlock.vue'
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
