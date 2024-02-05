<template>
<div class="header">
  <CustomSearch
    :searchedLocations="searchedLocations"
    @searchDataEmit="(value) => getSearchData(value)"
    @getDataToCoordinatesEmit="(value) => getDataToCoordinates(value)"
  />
</div>
</template>
<script setup>
import CustomSearch from './CustomSearch.vue'
import { onBeforeUnmount, onMounted, ref, inject } from 'vue'

const $api = inject('$api')
const searchLocation = ref('Київ')
const timeoutPending = ref(null)
const searchedLocations = ref([])
const params = ref({
  cityName: 'Київ'
})


// ==================== function section ====================

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
    console.log('Response Data City', response)
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