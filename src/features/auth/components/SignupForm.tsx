/**
 * 회원가입 폼 컴포넌트
 * react-hook-form + zod 유효성 검사
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import * as z from 'zod';
import { useSignup } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  full_name: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: signup, isPending, isError, error } = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signup(data, {
      onSuccess: () => {
        toast({
          title: '회원가입 성공',
          description: '로그인 페이지로 이동합니다.',
        });
        navigate('/login', { replace: true });
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          title: '회원가입 실패',
          description: err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.',
        });
      },
    });
  };

  // 에러 발생 시 토스트 표시
  useEffect(() => {
    if (isError && error) {
      toast({
        variant: 'destructive',
        title: '회원가입 오류',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      });
    }
  }, [isError, error, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            새로운 계정을 만들어 KIS Stock Trading을 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름 (선택사항)</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>최소 8자 이상</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? '가입 중...' : '회원가입'}
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                이미 계정이 있나요?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  로그인
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
