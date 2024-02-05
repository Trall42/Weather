<script setup>
import { ref, defineProps, watch, defineEmits } from 'vue'

const props = defineProps(['searchedLocations'])
const emit = defineEmits(['getDataToCoordinatesEmit', 'searchDataEmit'])

const searchDataManually = ref('')
const searchedLocationsManually = ref([])

// ================== watch section =======================

watch(() => props?.searchedLocations, (value) => {
  searchedLocationsManually.value = value
}, { immediate: true })

// ================== function section ====================

function chooseLocation(value) {
  searchedLocationsManually.value = []
  searchDataManually.value = value.name
  emit("getDataToCoordinatesEmit", value)
}

function selectingLocation() {
  console.log('Selecting', searchDataManually.value)
  emit("searchDataEmit", searchDataManually.value)
}

</script>

<template>
<div class="search-wrapper">
  <input v-model='searchDataManually' type='text' @input='selectingLocation' @focus="selectingLocation">
  <div v-if='searchedLocationsManually?.length && searchDataManually?.length' class="search-wrapper__popap">
    <div
      v-for='(location, index) in searchedLocationsManually'
      :key='index'
      @click.stop='chooseLocation(location)'
      class="search-item"
    >
      {{ location?.display_name }}
    </div>
  </div>
</div>
</template>
<style lang="scss">
.search-wrapper {
  input {
    width: 100%;
    max-width: 200px;
    height: 28px;
    border-radius: 8px;
    border: 2px solid grey;
    background: rgba(128, 128, 128, 0.2);
    padding: 0 8px;
  }
  .search-wrapper__popap {
    margin-top: 4px;
    padding: 16px;
    border-radius: 10px;
    width: 100%;
    max-width: 300px;
    border: 1px solid grey;
    background: rgba(128, 128, 128, 0.1);
    max-height: 300px;
    overflow-y: auto;
  }
  .search-item {
    margin-bottom: 6px;
    border-bottom: 1px solid grey;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      cursor: pointer;
      background: rgba(128, 128, 128, 0.4);
      box-sizing: border-box;
    }
  }
}
</style>