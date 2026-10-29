import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import CreateArticle from '../views/CreateArticle.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/editor',
    name: 'Editor',
    component: CreateArticle,
    meta: { requiresAuth: true } // Đánh dấu đây là trang bảo mật cần token
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Chốt chặn bảo mật Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    alert('Vui lòng đăng nhập để truy cập khu vực quản trị viết bài!');
    next('/login');
  } else {
    next();
  }
})

export default router