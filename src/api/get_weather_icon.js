export default ($axios) => ({
  getWeatherIcon(params) {
    return $axios.get(`https://openweathermap.org/img/wn/${params}@2x.png`)
  }
})