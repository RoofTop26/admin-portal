<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../api.js'

const users = ref([])
const loading = ref(true)
const errorMessage = ref('')

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/admin/users')
    users.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được danh sách user'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

const deletingId = ref(null)

const handleDelete = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return
  deletingId.value = id
  try {
    await apiClient.delete(`/admin/users/${id}`)
    fetchUsers()
  } catch (error) {
    alert(error.response?.data?.error || 'Xóa thất bại')
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1>Quản lý User</h1>
      <router-link to="/users/create">
        <button
          style="padding: 10px 20px; background-color: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;">Tạo
          User</button>
      </router-link>
    </div>

    <div v-if="loading">Đang tải...</div>

    <div v-else>
      <div v-if="errorMessage" style="color: red; margin-bottom: 15px;">{{ errorMessage }}</div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f0f0f0; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Username</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Name</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Ngày sinh</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td style="padding: 10px; border: 1px solid #ddd;">{{ user.id }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ user.username }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ user.name }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ user.dob }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <span v-if="user.status === 'ACTIVE'"
                style="background-color: #d4f7dc; color: #1a7a34; padding: 4px 10px; border-radius: 12px; font-size: 13px;">ACTIVE</span>
              <span v-else
                style="background-color: #fbd4d4; color: #a11a1a; padding: 4px 10px; border-radius: 12px; font-size: 13px;">INACTIVE</span>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <router-link :to="`/users/${user.id}/edit`">
                <button :disabled="deletingId === user.id"
                  style="margin-right: 8px; padding: 5px 10px; cursor: pointer;">Edit</button>
              </router-link>
              <button @click="handleDelete(user.id)" :disabled="deletingId === user.id"
                style="padding: 5px 10px; cursor: pointer; background-color: #e74c3c; color: white; border: none; border-radius: 4px;">
                {{ deletingId === user.id ? 'Đang xóa...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>