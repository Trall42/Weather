<script setup>
import { ref, defineProps, watch, defineEmits, onMounted } from 'vue'

const props = defineProps(['searchedLocations', 'isShowSearchField'])
const emit = defineEmits(['getDataToCoordinatesEmit', 'searchDataEmit', 'blurField'])

const searchDataManually = ref('')
const searchedLocationsManually = ref([])
const searchField = ref(null)

// ================== watch section =======================

watch(() => props?.searchedLocations, (value) => {
  searchedLocationsManually.value = value
}, { immediate: true })

watch(() => props?.isShowSearchField, (value) => {
  if (value) setFocusInputField()
})

// ================== function section ====================

function chooseLocation(value) {
  searchedLocationsManually.value = []
  searchDataManually.value = value.name
  emit("getDataToCoordinatesEmit", value)
}

function selectingLocation() {
  // console.log('Selecting', searchDataManually.value)
  emit("searchDataEmit", searchDataManually.value)
}

function setFocusInputField() {
  searchField?.value?.focus()
}

function bluerFieldInput() {
  if (!searchDataManually.value) emit('blurField')
}

// =================== life hooks =========================

onMounted(() => {
  // setFocusInputField()
})

</script>

<template>
<div class="search-wrapper">
  <input
    v-model='searchDataManually'
    ref="searchField"
    type='text'
    @input='selectingLocation'
    @focus="selectingLocation"
    @blur="bluerFieldInput"
  >
  <div v-if='searchedLocationsManually?.length && searchDataManually?.length' class="search-wrapper__popap">
    <div
      v-for='(location, index) in searchedLocationsManually'
      :key='index'
      @click.stop='chooseLocation(location)'
      class="search-item truncate"
    >
      {{ location?.display_name }}
    </div>
  </div>
</div>
</template>
<style lang="scss">
.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px;
  input {
    width: 100%;
    height: 32px;
    border-radius: 8px;
    border: 2px solid grey;
    background: rgba(255, 255, 255, 0.8);
    padding: 0 8px;
  }
  .search-wrapper__popap {
    position: absolute;
    top: 32px;
    left: 0;
    padding: 16px;
    border-radius: 10px;
    width: 100%;
    max-width: 300px;
    border: 1px solid grey;
    background: rgba(255, 255, 255, 0.8);
    max-height: 300px;
    overflow-y: auto;
  }
  .search-item {
    margin-bottom: 6px;
    border-bottom: 1px solid grey;
    width: 100%;
    &:hover {
      cursor: pointer;
      background: rgba(128, 128, 128, 0.4);
      box-sizing: border-box;
    }
  }
}
</style>