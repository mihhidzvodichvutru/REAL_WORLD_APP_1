import http from 'k6/http';
import { check, sleep } from 'k6';
import { env } from 'node:process';

// Cấu hình kịch bản dội tải - Đã nâng cấp hỏa lực
export const options = {
  vus: 100, // Huy động 100 người dùng ảo cùng lúc (nhân đôi sức ép)
  duration: '30s', // Nã đạn liên tục trong 30 giây
  thresholds: {
    // Đặt ra tiêu chuẩn SQA: 95% request phải phản hồi dưới 500ms
    http_req_duration: ['p(95)<500'], 
    // Tỷ lệ lỗi (VD: 500 Internal Server Error, 429 Too Many Requests) phải dưới 1%
    http_req_failed: ['rate<0.01'], 
  },
};

export default function () {
  // Bắt URL từ biến môi trường của GitHub Actions, nếu không có thì chạy mặc định
  const BASE_URL = env.BASE_URL || 'http://localhost:3000/api';

  // Bắn request vào API Đọc danh sách bài viết (GET /articles)
  const res = http.get(`${BASE_URL}/articles`);

  // Kiểm tra kết quả trả về
  check(res, {
    'Trạng thái trả về là 200 OK': (r) => r.status === 200,
    'Thời gian phản hồi < 1 giây': (r) => r.timings.duration < 1000,
  });

  // Mỗi VUs nghỉ 1 giây trước khi bắn request tiếp theo để tránh bị khóa IP do DDoS bảo vệ tự động
  sleep(1);
}