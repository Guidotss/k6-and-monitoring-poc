import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metric
const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '30s', target: 5 }, 
    { duration: '1m', target: 10 },  
    { duration: '30s', target: 0 },  
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], 
    http_req_failed: ['rate<0.1'],   
  },
};

export default function () {
  const urls = [
    'https://test.k6.io',
    'https://httpbin.org/delay/1',
    'https://httpbin.org/status/200',
    'https://httpbin.org/status/404',
  ];
  
  const url = urls[Math.floor(Math.random() * urls.length)];
  
  const res = http.get(url);
  
  sleep(Math.random() * 2 + 0.5);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  errorRate.add(res.status !== 200);
}
