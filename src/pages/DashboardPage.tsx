/**
 * 대시보드 페이지 (보호된 페이지)
 * 로그인한 사용자만 접근 가능
 */

import { useAuthStore } from '@/features/auth/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">대시보드</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          KIS Stock Trading 메인 화면
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>환영합니다!</CardTitle>
          <CardDescription>
            {user?.full_name || user?.email}님, 로그인에 성공하셨습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">이메일:</span> {user?.email}
            </p>
            {user?.full_name && (
              <p>
                <span className="font-medium">이름:</span> {user.full_name}
              </p>
            )}
            <p>
              <span className="font-medium">계정 상태:</span>{' '}
              <span className={user?.is_active ? 'text-green-600' : 'text-red-600'}>
                {user?.is_active ? '활성' : '비활성'}
              </span>
            </p>
            <p>
              <span className="font-medium">인증 제공자:</span> {user?.auth_provider}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>다음 단계</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>잔고 조회 화면 개발 예정</li>
            <li>주식 검색 및 주문 기능 개발 예정</li>
            <li>포트폴리오 분석 기능 개발 예정</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
