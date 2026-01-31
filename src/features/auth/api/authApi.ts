/**
 * 인증 API 호출 함수
 * Axios를 이용한 백엔드 통신
 */

import apiClient from '@/api/axios';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  User,
} from '../types/auth.types';

export const authApi = {
  /**
   * 로그인 API 호출
   * @param data - 이메일, 비밀번호
   * @returns Access Token
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data;
  },

  /**
   * 회원가입 API 호출
   * @param data - 이메일, 비밀번호, 이름(선택)
   * @returns 생성된 User 정보
   */
  signup: async (data: SignupRequest): Promise<User> => {
    const response = await apiClient.post('/api/v1/auth/signup', data);
    return response.data;
  },

  /**
   * 현재 로그인한 사용자 정보 조회
   * @returns User 정보
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },
};
