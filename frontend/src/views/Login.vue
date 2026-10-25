<template>
  <div style="max-width: 400px; margin: 40px auto; font-family: sans-serif;">
    <h2>Đăng nhập hệ thống</h2>
    <form @submit.prevent="handleLogin">
      <div style="margin-bottom: 10px;">
        <label>Email:</label><br/>
        <input v-model="form.email" type="email" required style="width: 100%; padding: 8px;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label>Password:</label><br/>
        <input v-model="form.password" type="password" required style="width: 100%; padding: 8px;" />
      </div>
      <button type="submit" style="padding: 10px 20px; background: #1976d2; color: white; border: none; cursor: pointer;">Đăng Nhập</button>
    </form>
    <p style="margin-top: 15px; color: green;" v-if="message">{{ message }}</p>
    <p style="margin-top: 15px; color: red;" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const form = ref({ email: '', password: '' })
const message = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    message.value = ''
    error.value = ''
    const response = await api.post('/users/login', { user: form.value })
    const token = response.data.user.token
    localStorage.setItem('jwt_token', token)
    message.value = `Đăng nhập thành công! Token đã được lưu.`
  } catch (err) {
    error.value = 'Lỗi đăng nhập: ' + (err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err.message)
  }
}
</script>