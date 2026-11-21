<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../api.js'
import { formatPrice } from '../utils/format.js'

const orders = ref([])
const loading = ref(true)
const errorMessage = ref('')

const fetchOrders = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await apiClient.get('/admin/orders')
    orders.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được danh sách đơn hàng'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

const handleConfirm = async (id) => {
  if (!confirm('Bạn có chắc muốn xác nhận đơn hàng này?')) return
  errorMessage.value = ''
  try {
    await apiClient.patch(`/admin/orders/${id}/confirm`)
    await fetchOrders()
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Xác nhận đơn hàng thất bại'
  }
}

const handleCancel = async (id) => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return
  errorMessage.value = ''
  try {
    await apiClient.patch(`/admin/orders/${id}/cancel`)
    await fetchOrders()
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Hủy đơn hàng thất bại'
  }
}
</script>

<template>
  <div>
    <h1>Quản lý Đơn hàng</h1>

    <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-weight: 500;">
      {{ errorMessage }}
    </div>

    <div v-if="loading">Đang tải...</div>

    <div v-else>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f0f0f0; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
            <th style="padding: 10px; border: 1px solid #ddd;">User</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Ngày</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Tổng tiền</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Trạng thái</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td style="padding: 10px; border: 1px solid #ddd;">
              <router-link :to="`/orders/${order.id}`">{{ order.id }}</router-link>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ order.userName }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ new Date(order.createdAt).toLocaleString('vi-VN') }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ formatPrice(order.totalAmount) }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <span v-if="order.status === 'PENDING'"
                style="background-color: #fff3cd; color: #856404; padding: 4px 10px; border-radius: 12px; font-size: 13px;">PENDING</span>
              <span v-else-if="order.status === 'CONFIRMED'"
                style="background-color: #d4f7dc; color: #1a7a34; padding: 4px 10px; border-radius: 12px; font-size: 13px;">CONFIRMED</span>
              <span v-else
                style="background-color: #fbd4d4; color: #a11a1a; padding: 4px 10px; border-radius: 12px; font-size: 13px;">CANCELLED</span>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <button v-if="order.status === 'PENDING'" @click="handleConfirm(order.id)"
                style="margin-right: 8px; padding: 5px 10px; cursor: pointer; background-color: #42b883; color: white; border: none; border-radius: 4px;">
                Xác nhận
              </button>
              <button v-if="order.status !== 'CANCELLED'" @click="handleCancel(order.id)"
                style="padding: 5px 10px; cursor: pointer; background-color: #e74c3c; color: white; border: none; border-radius: 4px;">
                Hủy
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
