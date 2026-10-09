<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../api.js'

const products = ref([])
const categories = ref([])
const selectedCategoryId = ref('')
const loading = ref(true)
const errorMessage = ref('')
const deletingId = ref(null)

const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/admin/categories')
    categories.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được danh sách danh mục'
  }
}

const fetchProducts = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const url = selectedCategoryId.value
      ? `/admin/products/category/${selectedCategoryId.value}`
      : '/admin/products'
    const response = await apiClient.get(url)
    products.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được danh sách sản phẩm'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)
onMounted(fetchProducts)

const handleDelete = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return
  deletingId.value = id
  errorMessage.value = ''
  try {
    await apiClient.delete(`/admin/products/${id}`)
    await fetchProducts()
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Xóa sản phẩm thất bại'
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1>Quản lý Sản phẩm</h1>
      <router-link to="/products/create">
        <button
          style="padding: 10px 20px; background-color: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;">Tạo
          sản phẩm</button>
      </router-link>
    </div>

    <div style="margin-bottom: 20px;">
      <label style="margin-right: 10px;">Lọc theo danh mục:</label>
      <select v-model="selectedCategoryId" @change="fetchProducts" style="padding: 8px;">
        <option value="">Tất cả</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
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
            <th style="padding: 10px; border: 1px solid #ddd;">Giá</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Tồn kho</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Danh mục</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td style="padding: 10px; border: 1px solid #ddd;">{{ product.id }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ product.name }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ product.price }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ product.stock }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ product.categoryName }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <span v-if="product.status === 'ACTIVE'"
                style="background-color: #d4f7dc; color: #1a7a34; padding: 4px 10px; border-radius: 12px; font-size: 13px;">ACTIVE</span>
              <span v-else
                style="background-color: #fbd4d4; color: #a11a1a; padding: 4px 10px; border-radius: 12px; font-size: 13px;">INACTIVE</span>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <router-link :to="`/products/${product.id}/edit`">
                <button :disabled="deletingId === product.id"
                  style="margin-right: 8px; padding: 5px 10px; cursor: pointer;">Edit</button>
              </router-link>
              <button @click="handleDelete(product.id)" :disabled="deletingId === product.id"
                style="padding: 5px 10px; cursor: pointer; background-color: #e74c3c; color: white; border: none; border-radius: 4px;">
                {{ deletingId === product.id ? 'Đang xóa...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
