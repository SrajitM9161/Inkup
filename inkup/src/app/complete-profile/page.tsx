'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getMe } from '../api/api';
import Image from 'next/image';
import ProfileCompletionStepper from '../(modals)/modals/ProfileCompletionStepper';

type User = {
  name: string;
  email: string;
  isProfileCompleted: boolean; // We now get this from the API
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

        // ✅ Defensive Check: If profile is already complete, redirect to dashboard.
        if (userData.isProfileCompleted) {
          toast.success("Your profile is already complete!");
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

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading your profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="p-8 rounded-2xl w-full max-w-lg text-white shadow-2xl border border-white/50 bg-gradient-to-b from-[#d9d9d9]/20 to-[#f8f8f8]/20 backdrop-blur-[10px]">
        <div className="flex justify-center items-center py-6">
            <Image src="/logoinkara.png" alt="Logo" width={120} height={40} />
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-gray-300">Let's complete your profile to get started.</p>
        </div>
        
        <ProfileCompletionStepper
          initialData={{ name: user.name, email: user.email }}
        />
      </div>
    </div>
  );
}