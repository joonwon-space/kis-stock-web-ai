/**
 * 인증 관련 TypeScript 타입 정의
 * 백엔드 Pydantic 모델과 1:1 매칭
 */

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  auth_provider: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
}
