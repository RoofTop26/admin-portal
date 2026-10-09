<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const name = ref('')
const description = ref('')
const status = ref('ACTIVE')
const errorMessage = ref('')
const loading = ref(true)
const submitting = ref(false)

const fetchCategory = async () => {
  loading.value = true
  try {
    const response = await apiClient.get(`/admin/categories/${id}`)
    name.value = response.data.name
    description.value = response.data.description
    status.value = response.data.status
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được thông tin danh mục'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategory)

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiClient.put(`/admin/categories/${id}`, {
      name: name.value,
      description: description.value,
      status: status.value
    })
    router.push('/categories')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Cập nhật thất bại'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px;">
    <h1>Sửa Danh mục</h1>
    <div v-if="loading">Đang tải...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Tên:</label>
        <input v-model="name" type="text" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mô tả:</label>
        <input v-model="description" type="text" style="width: 100%; padding: 8px; box-sizing: border-box;" />
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
