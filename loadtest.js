import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình kịch bản dội tải toàn diện qua các giai đoạn (Ramp-up, Sustained Load, Ramp-down)
export const options = {
  stages: [
    { duration: '20s', target: 30 },  // Tăng dần lên 30 người dùng ảo trong 20 giây đầu
    { duration: '40s', target: 100 }, // Đẩy tải lên 100 người dùng đồng thời trong 40 giây tiếp theo
    { duration: '20s', target: 0 },   // Giảm tải dần về 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% tổng số request phải phản hồi dưới 500ms
    http_req_failed: ['rate<0.01'],   // Tỷ lệ lỗi toàn hệ thống phải dưới 1%
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api';

  // ==========================================
  // KỊCH BẢN 1: Đọc danh sách bài viết (Read-heavy)
  // ==========================================
  let resArticles = http.get(`${BASE_URL}/articles?limit=10&offset=0`);
  check(resArticles, {
    'GET Articles - Trạng thái 200 OK': (r) => r.status === 200,
    'GET Articles - Phản hồi < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(0.5);

  // ==========================================
  // KỊCH BẢN 2: Đăng nhập hệ thống (Compute-heavy / CPU-bound)
  // Đánh giá tác động của thuật toán băm mật khẩu bcryptjs
  // ==========================================
  let loginPayload = JSON.stringify({
    user: {
      email: 'khonoi@gmail.com',
      password: 'anthan123',
    },
  });

  let loginParams = {
    headers: { 'Content-Type': 'application/json' },
  };

  let resLogin = http.post(`${BASE_URL}/users/login`, loginPayload, loginParams);
  check(resLogin, {
    'POST Login - Trạng thái 200 OK': (r) => r.status === 200,
    'POST Login - Phản hồi < 1000ms': (r) => r.timings.duration < 1000,
  });

  // Bóc tách JWT Token từ kết quả trả về để chuẩn bị cho kịch bản ghi dữ liệu
  let authToken = '';
  try {
    let body = JSON.parse(resLogin.body);
    authToken = body.user ? body.user.token : '';
  } catch (e) {
    // Bỏ qua lỗi parse ngoại lệ dưới áp lực tải cao
  }

  sleep(0.5);

  // ==========================================
  // KỊCH BẢN 3: Tạo bài viết mới (Write-heavy / I/O-bound)
  // Đánh giá khả năng xử lý đồng thời và Connection Pool của Supabase
  // ==========================================
  if (authToken) {
    let articlePayload = JSON.stringify({
      article: {
        title: `Load Test Article - VU ${__VU} - Iter ${__ITER} - ${Date.now()}`,
        description: 'Đồ án SQA - Nhóm BODOI Std kiểm thử hiệu năng',
        body: 'Nội dung kiểm thử dội tải tự động qua k6 framework.',
        tagList: ['sqa', 'load-test', 'bodoi-std'],
      },
    });

    let articleParams = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      },
    };

    let resArticle = http.post(`${BASE_URL}/articles`, articlePayload, articleParams);
    check(resArticle, {
      'POST Article - Trạng thái 201 Created': (r) => r.status === 201 || r.status === 200,
    });
  }

  sleep(1);
}