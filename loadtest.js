import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

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

// BƯỚC THU GOM BÁO CÁO HTML NẰM TÁCH BIỆT BÊN NGOÀI
export function handleSummary(data) {
  return {
    'loadtest-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}