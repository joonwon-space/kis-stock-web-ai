import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/axios';

function TestPage() {
  const [testEndpoint, setTestEndpoint] = useState('/docs');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['healthCheck', testEndpoint],
    queryFn: async () => {
      const response = await apiClient.get(testEndpoint);
      return response.data;
    },
    enabled: false, // 수동으로 호출하도록 설정
  });

  const handleTest = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          KIS Stock Trading - API 연결 테스트
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="endpoint"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              테스트할 엔드포인트:
            </label>
            <input
              id="endpoint"
              type="text"
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/docs"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              예: /docs, /health, /balance 등
            </p>
          </div>

          <button
            onClick={handleTest}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
          >
            {isLoading ? '요청 중...' : 'API 호출 테스트'}
          </button>

          {isError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2">
                ❌ 에러 발생
              </h3>
              <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-x-auto">
                {error instanceof Error ? error.message : '알 수 없는 에러'}
              </pre>
            </div>
          )}

          {data && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
              <h3 className="text-green-800 dark:text-green-300 font-semibold mb-2">
                ✅ 성공
              </h3>
              <pre className="text-sm text-green-600 dark:text-green-400 whitespace-pre-wrap overflow-x-auto max-h-64">
                {typeof data === 'string'
                  ? data.substring(0, 500) + (data.length > 500 ? '...' : '')
                  : JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            시스템 정보
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <span className="font-medium">Backend URL:</span>{' '}
              {import.meta.env.VITE_API_URL || '/api (proxy)'}
            </li>
            <li>
              <span className="font-medium">Environment:</span> {import.meta.env.MODE}
            </li>
            <li>
              <span className="font-medium">Vite Proxy:</span> /api → http://127.0.0.1:8000
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          KIS Stock Trading Frontend v0.0.1
        </div>
      </div>
    </div>
  );
}

export default TestPage;
