'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const AuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="flex justify-center items-center h-screen text-white">
      Logging you in...
    </div>
  );
};

export default AuthCallbackPage;
