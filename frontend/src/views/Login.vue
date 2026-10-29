<template>
  <div class="login-container">
    <div class="login-card">
      <h2>🔑 Đăng Nhập Hệ Thống</h2>
      <p class="subtitle">Nhóm BODOI Std — Đồ án Đảm bảo chất lượng phần mềm</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email đăng nhập:</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Nhập email của bạn..."
            required
          />
        </div>

        <div class="form-group">
          <label>Mật khẩu (Password):</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Nhập mật khẩu..."
            required
          />
        </div>

        <button type="submit" :disabled="isLoading" class="btn-login">
          {{ isLoading ? 'Đang xác thực...' : '🚀 Đăng Nhập & Vào Quản Trị' }}
        </button>
      </form>

      <!-- Thông báo trạng thái -->
      <div v-if="message" class="alert alert-success">
        {{ message }}
      </div>
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div class="login-footer">
        <p>Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const form = ref({ email: '', password: '' })
const message = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  try {
    message.value = ''
    error.value = ''
    isLoading.value = true

    // Gọi API đăng nhập RealWorld
    const response = await api.post('/users/login', { user: form.value })
    
    // Lấy token từ response (khớp với cấu trúc dữ liệu server trả về)
    const token = response.data.user.token
    
    // Lưu vào localStorage với key 'jwt_token' như kịch bản anh em mình đã thống nhất
    localStorage.setItem('jwt_token', token)
    
    message.value = `🎉 Đăng nhập thành công! Đang chuyển hướng vào không gian quản trị...`

    // 🚀 Tự động chuyển hướng sang trang quản trị /editor sau 0.8 giây để user kịp nhìn thông báo
    setTimeout(() => {
      router.push('/editor')
    }, 800)

  } catch (err) {
    error.value = 'Lỗi đăng nhập: ' + (err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 32px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-family: sans-serif;
}

.login-card h2 {
  margin: 0 0 6px 0;
  color: #1f2328;
  font-size: 22px;
}

.subtitle {
  margin: 0 0 24px 0;
  color: #57606a;
  font-size: 14px;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #24292f;
  font-size: 14px;
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #0969da;
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #1f883d;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
  margin-top: 6px;
}

.btn-login:hover {
  background-color: #1a7f37;
}

.btn-login:disabled {
  background-color: #94d3a2;
  cursor: not-allowed;
}

.alert {
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
  font-size: 14px;
}

.alert-success {
  background-color: #e6ffed;
  color: #22863a;
  border: 1px solid #34d058;
}

.alert-error {
  background-color: #ffeef0;
  color: #d73a49;
  border: 1px solid #f97583;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #57606a;
}

.login-footer a {
  color: #0969da;
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>