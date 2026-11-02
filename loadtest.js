import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api';
  const res = http.get(`${BASE_URL}/articles`);

  check(res, {
    'Trạng thái trả về là 200 OK': (r) => r.status === 200,
    'Thời gian phản hồi < 1 giây': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}