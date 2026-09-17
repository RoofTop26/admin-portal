<script setup>
const username = localStorage.getItem('username')
</script>

<template>
  <div>
    <h1>Xin chào, {{ username }}</h1>
    <div style="display: flex; gap: 20px; margin-top: 30px;">
      <router-link to="/admins" style="text-decoration: none; flex: 1;">
        <div style="padding: 40px; border: 1px solid #ccc; border-radius: 8px; text-align: center; font-size: 20px; color: #333;">
          Quản lý Admin
        </div>
      </router-link>
      <router-link to="/users" style="text-decoration: none; flex: 1;">
        <div style="padding: 40px; border: 1px solid #ccc; border-radius: 8px; text-align: center; font-size: 20px; color: #333;">
          Quản lý User
        </div>
      </router-link>
    </div>
  </div>
</template>