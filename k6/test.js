import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 5,
  duration: '60s',
};

export default function () {
    let res = http.get('https://test.k6.io'); 
  //let res = http.get('http://host.docker.internal:3000');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
