<template>
<div class="header">
  <div class="header-location">
    <img src="../assets/icons/location.png" class="img-size" alt="location">
    <span class="truncate">{{ curentWetherData.name }}</span>
  </div>
  <div class="header-search">
    <img
      v-if="!isShowSearchField"
      src="../assets/icons/search.png"
      class="img-size"
      alt="location"
      @click.stop="showHideSearchField()"
    >
    <CustomSearch
      :class="isShowSearchField ? 'header-search__field' : 'header-search__field--hide'"
      :isShowSearchField="isShowSearchField"
      :searchedLocations="searchedLocations"
      @searchDataEmit="(value) => getSearchData(value)"
      @getDataToCoordinatesEmit="(value) => getDataToCoordinates(value)"
      @blurField="showHideSearchField()"
    />
  </div>
</div>
</template>
<script setup>
import CustomSearch from './CustomSearch.vue'
import { onBeforeUnmount, onMounted, ref, inject } from 'vue'

const $api = inject('$api')
const searchLocation = ref('Київ')
const timeoutPending = ref(null)
const searchedLocations = ref([])
const isShowSearchField = ref(false)
const curentWetherData = ref({})
const params = ref({
  cityName: 'Київ'
})




// ==================== function section ====================

function showHideSearchField() {
  isShowSearchField.value = !isShowSearchField.value
}

function getSearchData(value) {
  searchLocation.value = value
  clearTimeout(timeoutPending.value)
  timeoutPending.value = setTimeout(async () => {
    await getLocationCity()
  }, 500)
}

async function fetchAllWeather() {
  try {
    const response = await $api.allWeather.getWeather(params?.value)
    if (response.status === 200) curentWetherData.value = response.data
    console.log('Response Data City', curentWetherData.value)
  } catch (error) {
    console.error('Error fetching fetchAllWeather:', error);
  }
}

async function getLocationCity() {
  try {
    const response = await $api.getLocation.getLocation(searchLocation.value)
    if (response.status === 200) searchedLocations.value = response.data
    console.log('Response Location', searchedLocations.value)
  } catch (error) {
    console.error('Error dettind location:', error);
  }
}

async function getDataToCoordinates(value) {
  saveDataToParams(value)
  await fetchAllWeather()
}

function saveDataToParams(value) {
  params.value.cityName = value?.name
}

// ===================== life hooks ====================

onBeforeUnmount(() => {
  clearTimeout(timeoutPending.value)
})

onMounted(async () => {
  await getLocationCity()
  await fetchAllWeather()
})
</script>

<style lang="scss">
.img-size {
  display: flex;
  align-items: center;
  width: 32px;
  height: 32px;
}
.header {
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .header-location {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 150px;
    span {
      margin-left: 4px;
      font-size: 18px;
      font-weight: 400;
      font-family: 'Roboto';
      color: $white;
    }
  }
  .header-search {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    min-width: 153px;
    img {
      cursor: pointer;
    }
    .header-search__field {
      transition: all 0.5s ease-out;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      &--hide {
        width: 0;
        opacity: 0;
        transition: all 0.5s ease-out;
      }
    }
  }
}
</style>