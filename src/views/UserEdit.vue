<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const name = ref('')
const dob = ref('')
const status = ref('ACTIVE')
const errorMessage = ref('')
const loading = ref(true)
const submitting = ref(false)

const fetchUser = async () => {
  loading.value = true
  try {
    const response = await apiClient.get(`/admin/users/${id}`)
    name.value = response.data.name
    dob.value = response.data.dob
    status.value = response.data.status
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được thông tin user'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUser)

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiClient.put(`/admin/users/${id}`, {
      name: name.value,
      dob: dob.value,
      status: status.value
    })
    router.push('/users')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Cập nhật thất bại'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px;">
    <h1>Sửa User</h1>
    <div v-if="loading">Đang tải...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Name:</label>
        <input v-model="name" type="text" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Ngày sinh:</label>
        <input v-model="dob" type="date" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Status:</label>
        <select v-model="status" style="width: 100%; padding: 8px;">
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">{{ errorMessage }}</div>

      <button type="submit" :disabled="submitting" style="width: 100%; padding: 10px; background-color: #42b883; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
        {{ submitting ? 'Đang lưu...' : 'Lưu' }}
      </button>
    </form>
  </div>
</template>