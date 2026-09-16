<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../services/axios.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    // Gọi API đăng nhập sang Spring Boot (Admin hoặc User)
    const response = await apiClient.post('/admin/login', {
      username: username.value,
      password: password.value
    })
    
    // Lưu token vào localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('role', response.data.role)
    
    alert('Đăng nhập thành công!')
    // Chuyển hướng về trang chủ hoặc dashboard
    router.push('/')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản!'
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 80px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif;">
    <h2>Đăng nhập hệ thống</h2>
    <form @submit.prevent="handleLogin">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Tài khoản:</label>
        <input 
          v-model="username" 
          type="text" 
          required 
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Nhập username..."
        />
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mật khẩu:</label>
        <input 
          v-model="password" 
          type="password" 
          required 
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Nhập password..."
        />
      </div>

      <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">
        {{ errorMessage }}
      </div>

      <button 
        type="submit" 
        style="width: 100%; padding: 10px; background-color: #42b883; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;"
      >
        Đăng nhập
      </button>
    </form>
  </div>
</template>