export default ($axios) => ({
  getLocation(params) {
    return $axios.get(`https://nominatim.openstreetmap.org/search?q=${params}&format=json&limit=10`)
  }
})