import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from './components/ui/toaster';
import { useMe } from './features/auth/hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

// TanStack Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분
      gcTime: 1000 * 60 * 5, // 5분 (cacheTime은 v5에서 gcTime으로 변경)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  // 앱 초기화 시 로그인 상태 확인 (isAuthenticated가 true일 때만 실행)
  useMe();

  return (
    <>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 보호된 라우트 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 루트 경로 - 대시보드로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 - 대시보드로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
