<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const username = localStorage.getItem('username')

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<template>
  <div>
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background-color: #42b883; color: white;">
      <div style="display: flex; gap: 25px; align-items: center;">
        <router-link to="/dashboard" style="color: white; font-weight: bold; text-decoration: none;">Admin Portal</router-link>
        <router-link to="/admins" style="color: white; text-decoration: none;">Quản lý Admin</router-link>
        <router-link to="/users" style="color: white; text-decoration: none;">Quản lý User</router-link>
      </div>
      <div style="display: flex; gap: 15px; align-items: center;">
        <span>{{ username }}</span>
        <button @click="handleLogout" style="padding: 6px 14px; cursor: pointer;">Đăng xuất</button>
      </div>
    </nav>
    <div style="padding: 30px;">
      <router-view />
    </div>
  </div>
</template>