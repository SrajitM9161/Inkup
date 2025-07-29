'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaInstagram } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import AuthButton from './AuthButton';
import SignupStepperForm from './TattooStepperForm';

export default function SignupModal({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; // ❌ removed token parameter
  onSuccess?: () => void;
}) {
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    if (!isOpen) setShowEmailForm(false);
  }, [isOpen]);

  const handleClose = () => {
    setShowEmailForm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center">
      <div className="p-8 rounded-2xl w-[400px] relative text-white shadow-2xl max-h-[90vh] overflow-y-auto border border-white/50 bg-gradient-to-b from-[#d9d9d9]/20 to-[#f8f8f8]/20 backdrop-blur-[10px]">

        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4 text-white hover:scale-105 transition"
        >
          <X size={20} />
        </button>

        <div className="text-center mt-6 mb-0 text-[22px] font-['Playball']">Logo</div>
  
         {showEmailForm ? (
          <SignupStepperForm
            onSubmit={() => {
              onSubmit();
              setTimeout(() => {
                onSuccess?.();
              }, 200);
            }}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <AuthButton
              Icon={FcGoogle}
              label="Continue with Google"
              onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`)}
            />
            <AuthButton
              Icon={FaApple}
              label="Continue with Apple"
              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/apple`}
            />
            <AuthButton
              Icon={FaInstagram}
              label="Continue with Instagram"
              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/instagram`}
            />
            <div className="flex items-center my-0">
              <div className="flex-grow h-px bg-gray-400"></div>
              <span className="mx-2 text-sm text-gray-300">Or</span>
              <div className="flex-grow h-px bg-gray-400"></div>
            </div>
            <AuthButton
              Icon={FiMail}
              label="Continue with Email"
              onClick={() => setShowEmailForm(true)}
            />
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-3 mb-9">
          By continuing, I agree to all terms and services
        </p>
      </div>
    </div>
  );
}