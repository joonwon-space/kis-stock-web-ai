import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
