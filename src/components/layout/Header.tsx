/**
 * 헤더 컴포넌트
 * 로그인 상태에 따라 사용자 정보 및 로그아웃 버튼 표시
 */

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          KIS Stock Trading
        </h1>

        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user.full_name || user.email}님
            </span>
            <Button variant="outline" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
