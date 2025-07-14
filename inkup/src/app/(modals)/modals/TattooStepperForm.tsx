'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormInput } from '../../Constants/Validation.schema';
import { useState } from 'react';
import Stepper, { Step } from '../../components/Stepper';
import { registerUser } from '../../API/Api';

export default function TattooStepperForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      businessName: '',
      phoneNumber: '',
      image: '',
    },
  });

  const onSubmit = async (data: SignupFormInput) => {
    setLoading(true);
    try {
      const result = await registerUser(data);
      alert('✅ Account created!');
      console.log('New user:', result);
    } catch (err: any) {
      alert(err?.response?.data?.message || '❌ Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleSubmit(onSubmit)}
        backButtonText="Back"
        nextButtonText="Next"
      >
        <Step>
          <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Welcome to Inkup</h2>
            <p className="text-gray-300">Let’s begin creating your tattoo studio profile</p>
          </div>
        </Step>

        <Step>
          <div className="space-y-4">
            <input
              {...register('name')}
              placeholder="Your full name"
              disabled={loading}
              className="w-full px-4 py-2 rounded bg-[#2E2E2E] text-white border border-gray-600"
            />
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}

            <input
              {...register('businessName')}
              placeholder="Studio name"
              disabled={loading}
              className="w-full px-4 py-2 rounded bg-[#2E2E2E] text-white border border-gray-600"
            />
            {errors.businessName && <p className="text-sm text-red-400">{errors.businessName.message}</p>}
          </div>
        </Step>

        <Step>
          <div className="space-y-4">
            <input
              {...register('email')}
              placeholder="Email address"
              type="email"
              disabled={loading}
              className="w-full px-4 py-2 rounded bg-[#2E2E2E] text-white border border-gray-600"
            />
            {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}

            <input
              {...register('phoneNumber')}
              placeholder="Phone number"
              disabled={loading}
              className="w-full px-4 py-2 rounded bg-[#2E2E2E] text-white border border-gray-600"
            />
            {errors.phoneNumber && <p className="text-sm text-red-400">{errors.phoneNumber.message}</p>}
          </div>
        </Step>

        <Step>
          <div className="space-y-4">
            <input
              {...register('password')}
              placeholder="Password"
              type="password"
              disabled={loading}
              className="w-full px-4 py-2 rounded bg-[#2E2E2E] text-white border border-gray-600"
            />
            {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
          </div>
        </Step>

        <Step>
          <div className="space-y-4">
            <input
              {...register('image')}
              placeholder="Image URL (optional)"
              disabled={loading}
              className="w-full px-4 py-2 rounded bg-[#2E2E2E] text-white border border-gray-600"
            />
            {errors.image && <p className="text-sm text-red-400">{errors.image.message}</p>}
          </div>
        </Step>

        <Step>
          <div className="space-y-4 text-center">
            <h2 className="text-xl text-white font-semibold">Ready to Inkup?</h2>
            <p className="text-gray-300">Submit to create your profile and start building your brand!</p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </Step>
      </Stepper>
    </form>
  );
}
