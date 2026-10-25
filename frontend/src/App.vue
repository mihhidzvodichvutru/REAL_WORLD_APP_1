<template>
  <div style="text-align: center; margin-top: 20px;">
    <h1>BODOI Std - RealWorld Frontend</h1>
    <nav style="margin: 20px 0;">
      <router-link to="/register" style="margin-right: 15px; text-decoration: none; color: #2e7d32; font-weight: bold;">Đăng Ký</router-link> |
      <router-link to="/login" style="margin-left: 15px; text-decoration: none; color: #1976d2; font-weight: bold;">Đăng Nhập</router-link>
    </nav>
    <hr style="max-width: 500px; margin: 20px auto;" />
    <router-view></router-view>
  </div>
</template>