<template>
<div class="weather-wrapper">
  <div class="header">
    <div class="header-location">
      <img src="../assets/icons/location.png" class="img-size" alt="location">
      <span class="truncate">{{ curentWetherData.name }}</span>
    </div>
    <div class="header-search__mobile">
      <img
        src="../assets/icons/search.png"
        class="img-size"
        :class="!isShowSearchField ? 'header-search__img' : 'header-search__img--hide'"
        alt="location"
        @click.stop="showHideSearchField()"
      >
      <CustomSearch
        :isShowSearchField="isShowSearchField"
        :searchedLocations="searchedLocations"
        :class="isShowSearchField ? 'header-search__field' : 'header-search__field--hide'"
        @searchDataEmit="(value) => getSearchData(value)"
        @getDataToCoordinatesEmit="(value) => getDataToCoordinates(value)"
        @blurField="showHideSearchField()"
      />
    </div>
    <div class="header-search__desctop">
      <CustomSearch
        :isShowSearchField="isShowSearchField"
        :searchedLocations="searchedLocations"
        @searchDataEmit="(value) => getSearchData(value)"
        @getDataToCoordinatesEmit="(value) => getDataToCoordinates(value)"
        @blurField="showHideSearchField()"
      />
    </div>
  </div>
  <div class="weather-main-data">
    <div class="weather-main-data__date">
      {{ currentDate }}
    </div>
    <div class="weather-main-data__status">
      <img :src="iconWeather" alt="weather">
      <div> {{ curentWetherData?.weather?.[0]?.main }} </div>
      <div>
        {{ Math.round(curentWetherData?.main?.temp) || 0 }}
        <div class="gradus-c">
           &deg;C
        </div>
      </div>
    </div>
    <div class="weather-simple-data">
      <div>
        <img src="../assets/icons/humidity.png" alt="humidity">
        <span>HUMIDITI</span>
        <span>{{ curentWetherData?.main?.humidity || 0 }} %</span>
      </div>
      <div>
        <img src="../assets/icons/wind.png" alt="wind">
        <span>WIND</span>
        <span>{{ curentWetherData?.wind?.speed || 0 }} km/h</span>
      </div>
      <div>
        <img src="../assets/icons/temp.png" alt="feels like">
        <span>FEELS LIKE</span>
        <span>{{ curentWetherData?.main?.feels_like || 0 }} &deg;</span>
      </div>
    </div>
  </div>
  <div class="weather-days"></div>
</div>
</template>
<script setup>
import CustomSearch from './CustomSearch.vue'
import { onBeforeUnmount, onMounted, ref, inject, nextTick } from 'vue'

const $api = inject('$api')
const searchLocation = ref('Київ')
const timeoutPending = ref(null)
const searchedLocations = ref([])
const isShowSearchField = ref(false)
const curentWetherData = ref({})
const params = ref({
  cityName: 'Київ'
})
const currentDate = ref('')
const iconWeather = ref(null)

// ==================== function section ====================


function formatData() {
  const unixTimestamp = curentWetherData?.value?.dt
  const milliseconds = unixTimestamp * 1000
  const date = new Date(milliseconds)
  const monthIndex = date.getMonth() + 1
  const day = date.getDate()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  currentDate.value = `${monthNames[monthIndex]?.toString().padStart(2, '0')} ${day.toString().padStart(2, '0')}`
}

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
    if (response.status === 200) {
      curentWetherData.value = response.data
      nextTick( async () => {
        formatData()
        await getWetherIcon(curentWetherData?.value?.weather[0]?.icon)
      })
    }
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
    console.error('Error gettind location:', error);
  }
}

async function getWetherIcon(iconCode) {
  try {
    const response = await $api.getWeatherIcon.getWeatherIcon(iconCode)
    iconWeather.value = response.config.url
  } catch (error) {
    console.error('Error getting icon weather', error);
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
.weather-wrapper {
  width: 100%;
  height: 100%;
  max-width: 768px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  .weather-main-data {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .weather-main-data__date {
      color: $white;
      font-weight: 500;
      font-family: 'Roboto';
      font-size: $font-size-40;
      text-shadow: rgb(68, 68, 68) 1px 6px 8px;
    }
    .weather-main-data__status {
      color: $white;
      margin-top: 38px;
      text-align: center;
      font-family: 'Roboto';
      text-shadow: rgb(68, 68, 68) 1px 8px 12px;
      & > div:nth-child(2) {
        line-height: 1;
        font-weight: 700;
        font-size: $font-size-40;
      }
      & > div:nth-child(3) {
        font-size: 70px;
        font-weight: 500;
        position: relative;
        width: min-content;
        margin: 0 auto;
        .gradus-c {
          position: absolute;
          top: 6px;
          right: -20px;
          font-size: $font-size-24;
          font-weight: 700;
        }
      }
    }
    .weather-simple-data {
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 600px;
      margin-top: 70px;
      & > div {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        img {
          display: block;
          width: 30px;
          height: 35px;
        }
      }
      & > div:nth-child(3) img {
        width: 20px;
      }
      span {
        display: inline-block;
        margin: 6px 0;
        color: $white;
        font-family: 'Roboto';
        font-size: $font-size-14;
        font-weight: 500;
        text-shadow: rgb(68, 68, 68) 1px 3px 4px;
      }
    }
  }
}
.img-size {
  display: flex;
  align-items: center;
  width: 32px;
  height: 32px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  .header-location {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 100px;
    span {
      margin-left: 4px;
      font-size: $font-size-18;
      font-weight: 400;
      font-family: 'Roboto';
      color: $white;
    }
  }
  .header-search__mobile {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    min-width: 32px;
    img {
      cursor: pointer;
    }
    .header-search__img {
      transition: all 0.5s ease-out;
      display: flex;
    }
    .header-search__field {
      transition: all 0.5s ease-out;
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
    .header-search__img--hide,
    .header-search__field--hide {
      width: 0;
      opacity: 0;
      transition: all 0.5s ease-out;
    }
  }
  .header-search__desctop {
    display: none;
  }
}

@media (min-width: 760px) {
  .weather-wrapper {
    padding: 24px;
    border: 1px solid rgb(197, 197, 197);
    border-radius: 15px;
    background: rgba(128, 139, 146, 0.2);
    box-shadow: 0px 0px 40px 2px rgb(37, 37, 37);
    .weather-simple-data {
      padding: 16px;
      border-radius: 15px;
      background: rgba(48, 48, 48, 0.4);
    }
  }
  .header .header-search__mobile {
    display: none;
  }
  .header .header-search__desctop {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
}
</style>