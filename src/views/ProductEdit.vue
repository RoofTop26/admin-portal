<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const name = ref('')
const description = ref('')
const price = ref('')
const stock = ref('')
const imageUrl = ref('')
const status = ref('ACTIVE')
const categoryId = ref('')
const categories = ref([])
const errorMessage = ref('')
const loading = ref(true)
const submitting = ref(false)

const fetchProduct = async () => {
  loading.value = true
  try {
    const categoryResponse = await apiClient.get('/admin/categories')
    categories.value = categoryResponse.data
    const response = await apiClient.get(`/admin/products/${id}`)
    name.value = response.data.name
    description.value = response.data.description
    price.value = response.data.price
    stock.value = response.data.stock
    imageUrl.value = response.data.imageUrl
    status.value = response.data.status
    categoryId.value = response.data.categoryId
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được thông tin sản phẩm'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduct)

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiClient.put(`/admin/products/${id}`, {
      name: name.value,
      description: description.value,
      price: price.value,
      stock: stock.value,
      imageUrl: imageUrl.value,
      status: status.value,
      categoryId: categoryId.value
    })
    router.push('/products')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Cập nhật thất bại'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px;">
    <h1>Sửa Sản phẩm</h1>
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
        <label style="display: block; margin-bottom: 5px;">Giá:</label>
        <input v-model="price" type="number" min="0" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Tồn kho:</label>
        <input v-model="stock" type="number" min="0" required style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Image URL:</label>
        <input v-model="imageUrl" type="text" style="width: 100%; padding: 8px; box-sizing: border-box;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Status:</label>
        <select v-model="status" style="width: 100%; padding: 8px;">
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Danh mục:</label>
        <select v-model="categoryId" required style="width: 100%; padding: 8px;">
          <option value="" disabled>-- Chọn danh mục --</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>

      <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">{{ errorMessage }}</div>

      <button type="submit" :disabled="submitting" style="width: 100%; padding: 10px; background-color: #42b883; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
        {{ submitting ? 'Đang lưu...' : 'Lưu' }}
      </button>
    </form>
  </div>
</template>
