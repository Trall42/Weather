<template>
  <div class="home">
    <span>{{ data }}</span>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const data = ref({})

async function getDataFromAxios() {
  try {
    const response = await axios.get('//jsonplaceholder.typicode.com/users')
    data.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(async () => {
  await getDataFromAxios()
  console.log('data', data)
})
</script>
