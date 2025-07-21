'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Hooks/useAuth.hook';

export default function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated) {
      router.replace('/dashboard');
    }
  }, [authenticated, loading, router]);

  if (loading || authenticated) return null;

  return <>{children}</>;
}
