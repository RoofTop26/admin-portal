<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '../api.js'
import { formatPrice } from '../utils/format.js'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const fetchOrder = async () => {
  try {
    const response = await apiClient.get(`/admin/orders/${route.params.id}`)
    order.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được chi tiết đơn hàng'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrder)
</script>

<template>
  <div>
    <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-weight: 500;">
      {{ errorMessage }}
    </div>

    <div v-if="loading">Đang tải...</div>

    <div v-else-if="order">
      <h1>Đơn hàng #{{ order.id }}</h1>

      <p>User: {{ order.userName }} (ID: {{ order.userId }})</p>
      <p>
        Trạng thái:
        <span v-if="order.status === 'PENDING'"
          style="background-color: #fff3cd; color: #856404; padding: 4px 10px; border-radius: 12px; font-size: 13px;">PENDING</span>
        <span v-else-if="order.status === 'CONFIRMED'"
          style="background-color: #d4f7dc; color: #1a7a34; padding: 4px 10px; border-radius: 12px; font-size: 13px;">CONFIRMED</span>
        <span v-else
          style="background-color: #fbd4d4; color: #a11a1a; padding: 4px 10px; border-radius: 12px; font-size: 13px;">CANCELLED</span>
      </p>
      <p>Ngày đặt: {{ new Date(order.createdAt).toLocaleString('vi-VN') }}</p>
      <p>Ghi chú: {{ order.note }}</p>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f0f0f0; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd;">Tên sản phẩm</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Giá lúc đặt</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Số lượng</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.productId">
            <td style="padding: 10px; border: 1px solid #ddd;">{{ item.productName }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ formatPrice(item.price) }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ item.quantity }}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ formatPrice(item.subtotal) }}</td>
          </tr>
        </tbody>
      </table>

      <h3>Tổng tiền: {{ formatPrice(order.totalAmount) }}</h3>
    </div>
  </div>
</template>
