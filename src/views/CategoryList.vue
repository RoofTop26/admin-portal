<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../api.js'

const categories = ref([])
const loading = ref(true)
const errorMessage = ref('')
const deletingId = ref(null)

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/admin/categories')
    categories.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được danh sách danh mục'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

const handleDelete = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return
  deletingId.value = id
  errorMessage.value = ''
  try {
    await apiClient.delete(`/admin/categories/${id}`)
    await fetchCategories()
  } catch (error) {
    if (error.response?.status === 409) {
      errorMessage.value = 'Danh mục đang có sản phẩm, không thể xóa'
    } else {
      errorMessage.value = error.response?.data?.error || 'Xóa danh mục thất bại'
    }
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1>Quản lý Danh mục</h1>
      <router-link to="/categories/create">
        <button
          style="padding: 10px 20px; background-color: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;">Tạo
          danh mục</button>
      </router-link>
    </div>

    <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-weight: 500;">
      {{ errorMessage }}
    </div>

    <div v-if="loading">Đang tải...</div>

    <div v-else>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f0f0f0; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Tên</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Mô tả</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td style="padding: 10px; border: 1px solid #ddd;">{{ category.id }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ category.name }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ category.description }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <span v-if="category.status === 'ACTIVE'"
                style="background-color: #d4f7dc; color: #1a7a34; padding: 4px 10px; border-radius: 12px; font-size: 13px;">ACTIVE</span>
              <span v-else
                style="background-color: #fbd4d4; color: #a11a1a; padding: 4px 10px; border-radius: 12px; font-size: 13px;">INACTIVE</span>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <router-link :to="`/categories/${category.id}/edit`">
                <button :disabled="deletingId === category.id"
                  style="margin-right: 8px; padding: 5px 10px; cursor: pointer;">Edit</button>
              </router-link>
              <button @click="handleDelete(category.id)" :disabled="deletingId === category.id"
                style="padding: 5px 10px; cursor: pointer; background-color: #e74c3c; color: white; border: none; border-radius: 4px;">
                {{ deletingId === category.id ? 'Đang xóa...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
