/**
 * 인증 관련 React Query Hooks
 * API 호출 및 스토어 연동
 */

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import type { LoginRequest, SignupRequest } from '../types/auth.types';

/**
 * 로그인 Mutation Hook
 * 성공 시 자동으로 토큰을 스토어에 저장하고 사용자 정보 조회
 */
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      // 1. 토큰 저장
      login(response.access_token);

      // 2. 사용자 정보 조회 쿼리 invalidate (useMe가 자동으로 실행됨)
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

/**
 * 회원가입 Mutation Hook
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
  });
};

/**
 * 현재 사용자 정보 조회 Query Hook
 * 로그인 상태일 때만 실행되며, 성공 시 스토어에 유저 정보 저장
 */
export const useMe = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated, // 로그인 상태일 때만 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    retry: false, // 실패 시 재시도 안함 (401 에러 시 자동 로그아웃)
  });

  // 데이터가 성공적으로 조회되면 스토어에 저장
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};

/**
 * 로그아웃 Hook
 * 스토어 초기화
 */
export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    // 향후 필요 시 서버에 로그아웃 API 호출 가능
  };
};
