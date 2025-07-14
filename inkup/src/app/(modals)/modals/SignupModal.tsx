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
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowEmailForm(false); 
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowEmailForm(false); 
    onClose();              
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-[#3D3D3D] p-8 rounded-2xl w-[400px] relative text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4 text-white hover:scale-105 transition"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-4 text-[22px] font-['Playball']">Logo</div>
        <h2 className="text-center text-2xl font-bold mb-4">
          {showEmailForm ? 'Sign up with Email' : 'Sign up to Inkup'}
        </h2>

        {showEmailForm ? (
          <SignupStepperForm />
        ) : (
          <div className="flex flex-col gap-4">
            <AuthButton Icon={FcGoogle} label="Continue with Google" />
            <AuthButton Icon={FaApple} label="Continue with Apple" />
            <AuthButton Icon={FaInstagram} label="Continue with Instagram" />

            <div className="flex items-center my-2">
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

        <p className="text-xs text-center text-gray-300 mt-4">
          By continuing, I agree to all terms and services
        </p>
      </div>
    </div>
  );
}
