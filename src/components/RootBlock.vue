<template>
<div class="weather-wrapper">
  <LoaderComponent v-if="isLoaded" />
  <div
    class="error-section"
    :class="{ 'error-section--show' : isError }"
  >
    <img src="../assets/icons/search-error.png  " alt="error">
    <span class="truncate">{{ errorMessage || Error }}</span>
  </div>
  <div class="header">
    <div class="header-location">
      <img src="../assets/icons/location.png" class="img-size" alt="location">
      <span class="truncate">{{ curentWetherData.name || 'N/A' }}</span>
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
      {{ formatData(curentWetherData?.dt) }}
    </div>
    <div class="weather-main-data__status">
      <img :src="iconWeatherList[currentDay]" alt="weather">
      <div> {{ curentWetherData?.weather?.[0]?.main || 'N/A' }} </div>
      <div>
        {{ Math.round(curentWetherData?.main?.temp) || 0 }}
        <div class="gradus-c">
           &deg;C
        </div>
      </div>
    </div>
    <div class="weather-main-data__simple">
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
    <div v-if="weatherToDaysList.length" class="weather-main-data__days-wrapper">
      <div
        v-for="(day, index) in weatherToDaysList"
        :key="index"
        class="weather-main-data__day"
        :class="{'active-block' : currentDay === index}"
        @click.stop="changeDay(index)"
      >
        <div class="weather-main-data__day-date">{{ formatData(day[0]?.dt) }}</div>
        <div>
          <img :src="iconWeatherList[index]" alt="weather icon">
        </div>
        <div class="weather-main-data__day-temp">
          {{ Math.round(day[4]?.main?.temp ? day[4]?.main?.temp : day[0]?.main?.temp) || 0 }}
          <div class="gradus-c">&deg;C</div>
        </div>
      </div>
    </div>
  </div>
  <div class="weather-days"></div>
</div>
</template>
<script setup>
import CustomSearch from './CustomSearch.vue'
import LoaderComponent from './LoaderComponent.vue'
import { onBeforeUnmount, onMounted, ref, computed, inject, nextTick } from 'vue'

const $api = inject('$api')
const searchLocation = ref('Київ')
const timeoutPending = ref(null)
const timeoutPendingError = ref(null)
const searchedLocations = ref([])
const isShowSearchField = ref(false)
const curentWetherData = ref({})
const currentDay = ref(0)
const params = ref({
  cityName: 'Київ'
})
const iconWeatherList = ref([])
const weatherToDaysData = ref([])
const weatherToDaysList = ref([])
const errorMessage = ref('')
const isLoaded = ref(false)

// ==================== computed section ====================

const isError = computed(() => {
  return !!errorMessage?.value?.length
})

// ==================== function section ====================


function formatData(dataTime = 0) {
  const unixTimestamp = dataTime
  const milliseconds = unixTimestamp * 1000
  const date = new Date(milliseconds)
  const monthIndex = date.getMonth()
  const day = date.getDate()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${monthNames[monthIndex]?.toString().padStart(2, '0')} ${day.toString().padStart(2, '0')}`
}

function showHideSearchField() {
  isShowSearchField.value = !isShowSearchField.value
}

function getSearchData(value) {
  searchLocation.value = value
  clearTimeout(timeoutPending.value)
  timeoutPending.value = setTimeout(async () => {
    await getLocationCity()
  }, 400)
}

async function fetchAllWeather() {
  await getWeatherForFiveDays(params?.value)
}

async function getLocationCity() {
  try {
    const response = await $api.getLocation.getLocation(searchLocation.value)
    if (response.status === 200) searchedLocations.value = response.data
  } catch (error) {
    console.error('Error gettind location:', error);
  }
}

async function getWetherIcon(iconCode) {
  iconWeatherList.value = []
  try {
    const response = await $api.getWeatherIcon.getWeatherIcon(iconCode)
    iconWeatherList.value.push(response.config.url)
  } catch (error) {
    console.error('Error getting icon weather', error);
  }
}

async function getWeatherForFiveDays() {
  isLoaded.value = true
  clearTimeout(timeoutPendingError.value)
  try {
    const response = await $api.getWeatherForSeveralDays.getWeatherForSeveralDays(params?.value)
    if (response?.status === 200) {
      weatherToDaysData.value = response.data
      nextTick(() => {
        breakDownTheDataByDay()
      })
    }
  } catch (error) {
    errorMessage.value = error.response.data.message
    console.error('Error getting weather for days', error);
  } finally {
    isLoaded.value = false
    timeoutPendingError.value = setTimeout(() => {
      errorMessage.value = ''
    }, 2000)
  }
}

function changeDay(index) {
  currentDay.value = index
  if (weatherToDaysList?.value[index][4]) curentWetherData.value = weatherToDaysList?.value[index][4]
  else curentWetherData.value = weatherToDaysList?.value[index][0]
  curentWetherData.value.name = searchedLocations?.value[0]?.name
}

function breakDownTheDataByDay() {
  isLoaded.value = true
  let firstDate = ''
  let numberOfDay = 0
  weatherToDaysList.value = []
  weatherToDaysList.value[numberOfDay] = []
  weatherToDaysData?.value?.list?.forEach((element) => {
    if (!weatherToDaysList.value[numberOfDay]?.length) {
      weatherToDaysList.value[numberOfDay].push(element)
      firstDate = element?.dt_txt?.slice(7, 10)
    }
    if (firstDate !== element?.dt_txt?.slice(7, 10)) {
      numberOfDay = numberOfDay + 1
      if (weatherToDaysList.value[numberOfDay] === undefined) weatherToDaysList.value[numberOfDay] = []
      weatherToDaysList.value[numberOfDay].push(element)
      firstDate = element?.dt_txt?.slice(7, 10)
    } else weatherToDaysList.value[numberOfDay].push(element)
  })
  curentWetherData.value = weatherToDaysList?.value[currentDay.value][0]
  curentWetherData.value.name = searchedLocations?.value[0]?.name
  if (curentWetherData.value) createIconsList()
  isLoaded.value = false
}

function createIconsList() {
  weatherToDaysList.value.forEach(async (item) => {
    if(item[4]?.weather[0]?.icon) await getWetherIcon(item[4]?.weather[0]?.icon)
    else await getWetherIcon(item[0]?.weather[0]?.icon)
  })
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
  clearTimeout(timeoutPendingError.value)
})

onMounted(async () => {
  await getLocationCity()
  await fetchAllWeather()
})
</script>

<style lang="scss">
.weather-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 768px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 16px;
  .error-section {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 60px;
    right: 0;
    width: 0;
    height: 60px;
    overflow: hidden;
    border-radius: 10px;
    opacity: 0;
    border: 1px solid red;
    background: rgb(187, 171, 171);
    transition: all 0.5s ease-out;
    img {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    span {
      display: flex;
      text-align: center;
      align-items: center;
      font-family: 'Roboto';
      font-size: $font-size-16;
      color: $red;
    }
    &--show {
      width: 200px;
      opacity: 1;
      transition: all 0.5s ease-out;
    }
  }
  .weather-main-data {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: auto 0;
    overflow-y: auto;
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
    .weather-main-data__simple {
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
    .weather-main-data__days-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 600px;
      margin-top: 50px;
      padding: 16px 8px;
      border-radius: 15px;
      border: 1px solid $grey-53;
      background: rgba(48, 48, 48, 0.4);
      column-gap: 4px;
      .weather-main-data__day {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
          width: 42px;
          height: 47px;
        }
        .weather-main-data__day-temp {
          position: relative;
          .gradus-c {
            position: absolute;
            top: 0px;
            right: -15px;
            font-size: $font-size-12;
            font-weight: 700;
          }
        }
      }
      .weather-main-data__day-date {
        text-align: center;
      }
    }
  }
}
.active-block {
  border: 1px solid $grey-53;
  border-radius: 10px;
  box-shadow: 0px 0px 15px $white;
  padding: 4px;
}
.weather-main-data__day-date,
.weather-main-data__day-temp {
  text-align: center;
  font-family: 'Roboto';
  font-size: $font-size-16;
  color: $white;
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
      text-shadow: rgb(68, 68, 68) 1px 3px 4px;
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
      padding: 0px;
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