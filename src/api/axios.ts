import axios from 'axios';

const apiClient = axios.create({
  // 개발 환경에서는 Vite Proxy(/api)를 사용하고, 프로덕션에서는 실제 API URL 사용
  baseURL: import.meta.env.MODE === 'development' ? '/api' : import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (추후 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: 인증 토큰 삽입
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 전역 에러 처리 (추후 Toast 알림 등)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
