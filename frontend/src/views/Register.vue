<template>
  <div style="max-width: 400px; margin: 40px auto; font-family: sans-serif;">
    <h2>Đăng ký tài khoản (BODOI Std)</h2>
    <form @submit.prevent="handleRegister">
      <div style="margin-bottom: 10px;">
        <label>Username:</label><br/>
        <input v-model="form.username" type="text" required style="width: 100%; padding: 8px;" />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Email:</label><br/>
        <input v-model="form.email" type="email" required style="width: 100%; padding: 8px;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label>Password:</label><br/>
        <input v-model="form.password" type="password" required style="width: 100%; padding: 8px;" />
      </div>
      <button type="submit" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; cursor: pointer;">Đăng Ký</button>
    </form>
    <p style="margin-top: 15px; color: green;" v-if="message">{{ message }}</p>
    <p style="margin-top: 15px; color: red;" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const form = ref({ username: '', email: '', password: '' })
const message = ref('')
const error = ref('')

const handleRegister = async () => {
  try {
    message.value = ''
    error.value = ''
    const response = await api.post('/users', { user: form.value })
    message.value = `Đăng ký thành công tài khoản: ${response.data.user.username}`
  } catch (err) {
    error.value = 'Lỗi đăng ký: ' + (err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err.message)
  }
}
</script>