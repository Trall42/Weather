<template>
  <div class="app">
    <div class="header-wrapper">
      <div class="location">
        <img src="./assets/icons/location.png" alt="location">
        <span>Paris</span>
      </div>
      <HeaderBlock />
    </div>
  </div>
</template>

<script setup>
import HeaderBlock from './components/HeaderBlock.vue'
</script>
<style lang="scss">
html {
  box-sizing: border-box;
  font-size: 16px;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol, ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

.app {
  border: 1px solid red;
  padding: 24px;
  width: 100%;
  height: 100vh;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid green;
  .location {
    display: flex;
    align-items: center;
    span {
      margin-left: 4px;
      font-family: Roboto Slab;
    }
    img {
      display: flex;
      align-items: center;
      width: 32px;
      height: 32px;
    }
  }
}
</style>
