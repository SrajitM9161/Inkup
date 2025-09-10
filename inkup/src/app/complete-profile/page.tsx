'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getMe } from '../api/api';
import Image from 'next/image';
import ProfileCompletionStepper from '../(modals)/modals/ProfileCompletionStepper';
import ModalWrapper from '../(modals)/modals/components/ModalWrapper';
import HomePage from '../(landing)/landing/Landing'; 
import { useRef } from 'react';

type User = {
  name: string;
  email: string;
  isProfileCompleted: boolean;
};

export default function CompleteProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        if (!userData) throw new Error('Not authenticated');
        if (userData.isProfileCompleted) {
          router.push('/dashboard');
          return;
        }
        setUser(userData);
      } catch (error) {
        toast.error('Authentication failed. Please log in.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 filter blur-md pointer-events-none" aria-hidden="true">
        <HomePage
          onOpenModal={() => {}}
          setShowFooter={() => {}}
          triggerRef={triggerRef}
          footerRef={footerRef}
        />
      </div>

      {loading || !user ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-white bg-black/50">
          Loading your profile...
        </div>
      ) : (
        <ModalWrapper onClose={() => router.push('/')}>
          <div className="flex justify-center items-center py-6">
            <Image src="/logoinkara.png" alt="Logo" width={120} height={40} />
          </div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-gray-300">Let's complete your profile to get started.</p>
          </div>
          <ProfileCompletionStepper initialData={{ name: user.name, email: user.email }} />
        </ModalWrapper>
      )}
    </div>
  );
}