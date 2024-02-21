import AllWeather from '../../api/get_all_weather'
import GetLocation from '../../api/get_location'
import GetWeatherIcon from '../../api/get_weather_icon'
import GetWeatherForSeveralDays from '../../api/get_several_days_weather'
import axios from 'axios'

const apiUrl = process.env

const repositories = {
  allWeather: AllWeather(axios, apiUrl),
  getWeatherIcon: GetWeatherIcon(axios),
  getLocation: GetLocation(axios),
  getWeatherForSeveralDays: GetWeatherForSeveralDays(axios, apiUrl)
}

const apiPlugin = {
  install(app) {
    app.provide('$api', repositories);
  }
}

export default apiPlugin;
