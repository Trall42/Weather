export default ($axios, $config) => ({
  getWeather(params) {
    return $axios.get(`${$config.VUE_APP_API_URL}${$config.VUE_APP_API_PATH}weather?q=${params?.cityName}&appid=${$config.VUE_APP_API_KEY}`)
    // return $axios.get(`${$config.VUE_APP_API_URL}${$config.VUE_APP_API_PATH}forecast?q=${params?.cityName}&appid=${$config.VUE_APP_API_KEY}`)
  }
})