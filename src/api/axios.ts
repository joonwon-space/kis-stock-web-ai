import axios from 'axios';
import { useAuthStore } from '@/features/auth/stores/authStore';

const apiClient = axios.create({
  // 개발 환경에서는 Vite Proxy(/api)를 사용하고, 프로덕션에서는 실제 API URL 사용
  baseURL: import.meta.env.MODE === 'development' ? '/api' : import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - 자동 토큰 주입
apiClient.interceptors.request.use(
  (config) => {
    // Zustand store에서 토큰 가져오기 (순환 참조 방지를 위해 getState 사용)
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - 401 에러 시 자동 로그아웃
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 에러 시 자동 로그아웃
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // 향후 필요 시 로그인 페이지로 리다이렉트 가능
      // window.location.href = '/login';
    }

    // 전역 에러 처리 (추후 Toast 알림 등)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
