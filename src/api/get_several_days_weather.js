export default ($axios, $config) => ({
  getWeatherForSeveralDays(params) {
    return $axios.get(`${$config.VUE_APP_API_URL}${$config.VUE_APP_API_PATH}forecast?q=${params?.cityName}&units=metric&appid=${$config.VUE_APP_API_KEY}`)
  }
})