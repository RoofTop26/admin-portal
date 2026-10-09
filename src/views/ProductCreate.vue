<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'

const router = useRouter()
const name = ref('')
const description = ref('')
const price = ref('')
const stock = ref('')
const imageUrl = ref('')
const status = ref('ACTIVE')
const categoryId = ref('')
const categories = ref([])
const errorMessage = ref('')
const submitting = ref(false)

const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/admin/categories')
    categories.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được danh sách danh mục'
  }
}

onMounted(fetchCategories)

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiClient.post('/admin/products', {
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
    errorMessage.value = error.response?.data?.error || 'Tạo sản phẩm thất bại'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px;">
    <h1>Tạo Sản phẩm</h1>
    <form @submit.prevent="handleSubmit">
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
        {{ submitting ? 'Đang tạo...' : 'Tạo Sản phẩm' }}
      </button>
    </form>
  </div>
</template>
