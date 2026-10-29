<template>
  <div class="app-layout">
    <!-- Thanh điều hướng (Header Navbar) -->
    <header class="navbar">
      <div class="navbar-container">
        <div class="brand">
          <span class="brand-badge">BODOI Std</span>
          <h1 class="brand-title">RealWorld Portal</h1>
        </div>

        <nav class="nav-links">
          <!-- Khi chưa đăng nhập -->
          <template v-if="!isLoggedIn">
            <router-link to="/register" class="nav-item">📝 Đăng Ký</router-link>
            <router-link to="/login" class="nav-item">🔑 Đăng Nhập</router-link>
          </template>

          <!-- Khi đã đăng nhập vào không gian quản trị -->
          <template v-else>
            <router-link to="/editor" class="nav-item nav-item-Create">✍️ Viết Bài Mới</router-link>
            <button @click="handleLogout" class="btn-logout" title="Xóa Token trong máy">
              🚪 Đăng Xuất
            </button>
          </template>
        </nav>
      </div>
    </header>

    <!-- Khu vực hiển thị nội dung các trang -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Chân trang phục vụ đồ án -->
    <footer class="footer">
      <p>Đồ án Đảm bảo chất lượng phần mềm — Nhóm <strong>BODOI Std</strong></p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Kiểm tra trạng thái đăng nhập dựa trên Token trong localStorage
const isLoggedIn = computed(() => {
  // Theo dõi route để tự động cập nhật giao diện khi chuyển trang
  const currentPath = route.path;
  return !!(localStorage.getItem('jwt_token') || localStorage.getItem('token'));
});

// Hàm hỗ trợ xóa Token và đăng xuất
const handleLogout = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('Đã đăng xuất thành công khỏi hệ thống quản trị!');
  router.push('/login');
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f6f8fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #24292f;
}

.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #d0d7de;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 12px 24px;
}

.navbar-container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-badge {
  background-color: #2ea44f;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1f2328;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-item {
  text-decoration: none;
  color: #57606a;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #1f2328;
}

.nav-item.router-link-active {
  background-color: #ddf4ff;
  color: #0969da;
}

.nav-item-Create {
  border: 1px solid #2ea44f;
  color: #2ea44f;
}

.nav-item-Create.router-link-active {
  background-color: #2ea44f;
  color: #ffffff;
}

.btn-logout {
  background: transparent;
  border: 1px solid #cf222e;
  color: #cf222e;
  font-weight: 600;
  font-size: 13px;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: #cf222e;
  color: #ffffff;
}

.main-content {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 30px auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.footer {
  text-align: center;
  padding: 16px;
  font-size: 13px;
  color: #6e7781;
  border-top: 1px solid #d0d7de;
  background: #ffffff;
}
</style>