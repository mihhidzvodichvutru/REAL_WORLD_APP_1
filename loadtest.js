import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình kịch bản dội tải
export const options = {
  vus: 100, // Huy động 100 người dùng ảo cùng lúc
  duration: '30s', // Nã đạn liên tục trong 30 giây
  thresholds: {
    http_req_duration: ['p(95)<500'], 
    http_req_failed: ['rate<0.01'], 
  },
};

export default function () {
  // SỬ DỤNG __ENV THAY VÌ node:process
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api';

  // Bắn request vào API Đọc danh sách bài viết
  const res = http.get(`${BASE_URL}/articles`);

  // Kiểm tra kết quả trả về
  check(res, {
    'Trạng thái trả về là 200 OK': (r) => r.status === 200,
    'Thời gian phản hồi < 1 giây': (r) => r.timings.duration < 1000,
  });

  // Mỗi VUs nghỉ 1 giây
  sleep(1);
}