<template>
  <div class="editor-container">
    <div class="editor-header">
      <h2>✍️ Không gian Quản trị - Đăng bài viết mới</h2>
      <p class="subtitle">Nhóm BODOI Std — Đồ án Đảm bảo chất lượng phần mềm</p>
    </div>

    <!-- Thông báo lỗi nếu có -->
    <div v-if="errorMessage" class="alert alert-error">
      ❌ {{ errorMessage }}
    </div>

    <!-- Thông báo thành công kèm Slug -->
    <div v-if="createdArticle" class="alert alert-success">
      <p>🎉 <strong>Xuất bản bài viết thành công (Mã 201 Created)!</strong></p>
      <p>🔗 <strong>Slug định danh:</strong> <code>{{ createdArticle.slug }}</code></p>
      <p>👤 <strong>Tác giả:</strong> {{ createdArticle.author?.username }}</p>
    </div>

    <form @submit.prevent="submitArticle" class="editor-form">
      <div class="form-group">
        <label>Tiêu đề bài viết (Title)</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Nhập tiêu đề bài viết..."
          required
        />
      </div>

      <div class="form-group">
        <label>Mô tả ngắn (Description)</label>
        <input
          v-model="form.description"
          type="text"
          placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
          required
        />
      </div>

      <div class="form-group">
        <label>Nội dung chi tiết (Body)</label>
        <textarea
          v-model="form.body"
          rows="6"
          placeholder="Nhập nội dung chi tiết báo cáo đồ án, kịch bản kiểm thử..."
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label>Thẻ phân loại (Tags - cách nhau bằng dấu phẩy)</label>
        <input
          v-model="form.tagsInput"
          type="text"
          placeholder="Ví dụ: testing, postman, bodoi-std, ci-cd"
        />
      </div>

      <button type="submit" :disabled="isLoading" class="btn-submit">
        {{ isLoading ? 'Đang gửi lên Server...' : '🚀 Xuất bản bài viết' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const form = reactive({
  title: '',
  description: '',
  body: '',
  tagsInput: 'testing, postman, bodoi-std, ci-cd'
});

const isLoading = ref(false);
const errorMessage = ref('');
const createdArticle = ref(null);

const submitArticle = async () => {
  errorMessage.value = '';
  createdArticle.value = null;

  // Quét token "bất tử" khớp với key 'jwt_token' trên trình duyệt của huynh
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('token') || localStorage.getItem('jwt');
  
  if (!token) {
    errorMessage.value = 'Chưa tìm thấy Token! Huynh vui lòng đăng nhập lại.';
    return;
  }

  // Chuyển chuỗi tags thành mảng chuẩn JSON
  const tagList = form.tagsInput
    ? form.tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
    : [];

  isLoading.value = true;

  try {
    const response = await fetch('http://localhost:3000/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        article: {
          title: form.title,
          description: form.description,
          body: form.body,
          tagList: tagList
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? 'Lỗi 401 Unauthorized: Token không hợp lệ hoặc đã hết hạn!'
          : `Lỗi ${response.status}: Không thể tạo bài viết.`
      );
    }

    // Lưu thông tin bài viết vừa tạo để hiển thị lên UI
    createdArticle.value = data.article;

    // Reset form
    form.title = '';
    form.description = '';
    form.body = '';
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.editor-container {
  max-width: 700px;
  margin: 20px auto;
  padding: 30px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-family: sans-serif;
}
.editor-header {
  margin-bottom: 24px;
  border-bottom: 2px solid #eaecef;
  padding-bottom: 12px;
}
.editor-header h2 {
  margin: 0 0 6px 0;
  color: #1f2328;
}
.subtitle {
  margin: 0;
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
.form-group input,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: #0969da;
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
}
.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #2ea44f;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}
.btn-submit:hover {
  background-color: #2c974b;
}
.btn-submit:disabled {
  background-color: #94d3a2;
  cursor: not-allowed;
}
.alert {
  padding: 14px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}
.alert-error {
  background-color: #ffeef0;
  color: #d73a49;
  border: 1px solid #f97583;
}
.alert-success {
  background-color: #e6ffed;
  color: #22863a;
  border: 1px solid #34d058;
}
</style>