<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiClient.post('/admin/admins', {
      username: username.value,
      password: password.value
    })
    router.push('/admins')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.response?.data?.message || 'Tạo admin thất bại'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px;">
    <h1>Tạo Admin</h1>
    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Username:</label>
        <input v-model="username" type="text" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Password:</label>
        <input v-model="password" type="password" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>

      <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">
        {{ errorMessage }}
      </div>

      <div style="display: flex; gap: 10px;">
        <button 
          type="submit" 
          :disabled="submitting" 
          style="flex: 1; padding: 10px; background-color: #42b883; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;"
        >
          {{ submitting ? 'Đang tạo...' : 'Tạo Admin' }}
        </button>
        <router-link to="/admins">
          <button type="button" style="padding: 10px 15px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">
            Hủy
          </button>
        </router-link>
      </div>
    </form>
  </div>
</template>