'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

interface FormData {
  businessName: string;
  email?: string;
  phone?: string;
  address?: string;
  password: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const isSignup = mode === 'signup';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' });

  const onSubmit = (data: FormData) => {
    const payload = isSignup
      ? data
      : {
          businessName: data.businessName,
          password: data.password,
        };
    console.log(mode, payload);
  };

  return (
    <div className="flex w-full flex-col md:flex-row max-h-[90vh] overflow-y-auto">
      <div className="hidden md:block w-full md:w-1/2">
        <img src="Auth.jpg" alt="Tattoo image" className="object-cover h-full w-full" />
      </div>
      <div className="w-full md:w-1/2 p-4 sm:p-6 text-white font-['Roboto'] flex flex-col justify-center">
        <h2 className="text-[20px] font-semibold mb-4">
          {isSignup ? 'SIGN UP' : 'SIGN IN OR CREATE AN ACCOUNT'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <LabelInput label="Business name*" {...register('businessName')} error={(errors as any)?.businessName?.message} placeholder="Enter business name" />

          {isSignup && (
            <>
              <LabelInput label="Email*" {...register('email')} error={(errors as any)?.email?.message} placeholder="Enter your email" />
              <LabelInput label="Phone number*" {...register('phone')} error={(errors as any)?.phone?.message} placeholder="Enter phone number" />
              <LabelInput label="Address*" {...register('address')} error={(errors as any)?.address?.message} placeholder="Enter your address" />
            </>
          )}

          <LabelInput label="Password*" type="password" {...register('password')} error={(errors as any)?.password?.message} placeholder="Create a password" />

          <button
            type="submit"
            className="w-full h-10 bg-[#EA9727] shadow-md rounded-md font-semibold text-sm text-[#1C1C1C] hover:opacity-90 transition"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="w-full h-12 mt-4 border border-white rounded-md flex items-center justify-center hover:opacity-90 transition">
          <p className="text-base font-medium">
            {isSignup ? 'Sign up with Google' : 'Login with Google'}
          </p>
        </div>

        <p className="text-center mt-3 text-sm font-light">
          {isSignup ? (
            <>Already have an account? <a href="/signin" className="font-bold">SIGN IN</a></>
          ) : (
            <>Don’t have an account? <a href="/signup" className="font-bold">SIGN UP</a></>
          )}
        </p>
      </div>
    </div>
  );
};

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const LabelInput = React.forwardRef<HTMLInputElement, LabelInputProps>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-white">{label}</label>
    <input
      ref={ref}
      {...props}
      className="w-full h-10 px-3 bg-[#1C1C1C] border border-white rounded-md text-white placeholder-white text-sm focus:outline-none"
    />
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
));
LabelInput.displayName = 'LabelInput';

export default AuthForm;