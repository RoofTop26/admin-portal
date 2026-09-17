<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../api.js'

const admins = ref([])
const loading = ref(true)
const errorMessage = ref('')
const deletingId = ref(null)

const fetchAdmins = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await apiClient.get('/admin/admins')
    admins.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được danh sách admin'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAdmins)

const handleDelete = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa admin này?')) return
  
  deletingId.value = id
  errorMessage.value = ''
  try {
    await apiClient.delete(`/admin/admins/${id}`)
    await fetchAdmins()
  } catch (error) {
    if (error.response && error.response.status === 403) {
      errorMessage.value = error.response.data?.error || 'Không thể xóa chính mình'
    } else {
      errorMessage.value = error.response?.data?.error || 'Xóa admin thất bại'
    }
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1>Quản lý Admin</h1>
      <router-link to="/admins/create">
        <button style="padding: 10px 20px; background-color: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Tạo Admin
        </button>
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
            <th style="padding: 10px; border: 1px solid #ddd; width: 80px;">ID</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Username</th>
            <th style="padding: 10px; border: 1px solid #ddd; width: 180px;">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins" :key="admin.id">
            <td style="padding: 10px; border: 1px solid #ddd;">{{ admin.id }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ admin.username }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <router-link :to="`/admins/${admin.id}/edit`">
                <button :disabled="deletingId === admin.id" style="margin-right: 8px; padding: 5px 10px; cursor: pointer;">
                  Edit
                </button>
              </router-link>
              <button 
                @click="handleDelete(admin.id)" 
                :disabled="deletingId === admin.id"
                style="padding: 5px 10px; cursor: pointer; background-color: #e74c3c; color: white; border: none; border-radius: 4px;"
              >
                {{ deletingId === admin.id ? 'Đang xóa...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>