/**
 * 메인 레이아웃 컴포넌트
 * 헤더를 포함한 기본 레이아웃 구조
 */

import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
