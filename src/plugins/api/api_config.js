import AllWeather from '../../api/get_all_weather'
import GetLocation from '../../api/get_location'
import axios from 'axios'

const apiUrl = process.env

const repositories = {
  allWeather: AllWeather(axios, apiUrl),
  getLocation: GetLocation(axios)
}

const apiPlugin = {
  install(app) {
    app.provide('$api', repositories);
  }
}

export default apiPlugin;
