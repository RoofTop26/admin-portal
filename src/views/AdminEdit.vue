<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(true)
const submitting = ref(false)

const fetchAdmin = async () => {
  loading.value = true
  try {
    const response = await apiClient.get(`/admin/admins/${id}`)
    username.value = response.data.username
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được thông tin admin'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAdmin)

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    const payload = { username: username.value }
    if (password.value && password.value.trim() !== '') {
      payload.password = password.value
    }
    await apiClient.patch(`/admin/admins/${id}`, payload)
    router.push('/admins')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.response?.data?.message || 'Cập nhật thất bại'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px;">
    <h1>Sửa Admin</h1>
    <div v-if="loading">Đang tải...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Username:</label>
        <input v-model="username" type="text" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Password mới (để trống nếu không đổi):</label>
        <input 
          v-model="password" 
          type="password" 
          placeholder="Nhập mật khẩu mới..." 
          style="width: 100%; padding: 8px; box-sizing: border-box;" 
        />
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
          {{ submitting ? 'Đang lưu...' : 'Lưu' }}
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