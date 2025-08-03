/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

import { registerUser, getMe } from '../../API/Api';
import Stepper from '../../components/Stepper';

const formSchema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Enter valid email'),
  password: z.string().min(8, 'Password must be 8+ chars'),
  phoneNumber: z.string().min(10, 'Phone must be 10+ digits'),
  address: z.string().min(2, 'Address required'),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  onSubmit: () => void;
}

export default function SignupStepperForm({ onSubmit }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      businessName: '',
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  // ✅ Show toast when an error is detected
  useEffect(() => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message.toString());
    }
  }, [errors]);

  const handleFinalSubmit = async (data: FormData) => {
    const payload = {
      businessName: data.businessName,
      name: data.fullName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      address: data.address,
    };

    try {
      const res = await registerUser(payload);

      if (!res.success) {
        toast.error(res.message || 'Signup failed');
        return;
      }

      toast.success('🎉 Registered successfully!');
      setTimeout(async () => {
        try {
          const user = await getMe();
          if (!user) throw new Error('User session not found');
          onSubmit?.();
          router.push('/dashboard');
        } catch (err) {
          console.log(err);
          toast.error('Auth check failed. Please login.');
          router.push('/');
        }
      }, 200);
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('Email already registered. Try logging in.');
        router.push('/');
      } else {
        console.error('Registration error:', err);
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const FormGroup = ({
    label,
    name,
    type = 'text',
    placeholder,
  }: {
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder: string;
  }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1" style={{ color: '#f8f8f8' }}>
        {label}*
      </label>
      <input
        id={name}
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="input w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const steps = [
    {
      label: 'Business Info',
      fields: ['businessName', 'fullName'] as (keyof FormData)[],
      content: (
        <>
          <FormGroup label="Business Name" name="businessName" placeholder="e.g. Inkify Studio" />
          <FormGroup label="Full Name" name="fullName" placeholder="e.g. Jane Doe" />
        </>
      ),
    },
    {
      label: 'Account Info',
      fields: ['email', 'password'] as (keyof FormData)[],
      content: (
        <>
          <FormGroup label="Email" name="email" type="email" placeholder="e.g. jane@example.com" />
          <FormGroup label="Password" name="password" type="password" placeholder="Create a strong password" />
        </>
      ),
    },
    {
      label: 'Contact Info',
      fields: ['phoneNumber', 'address'] as (keyof FormData)[],
      content: (
        <>
          <FormGroup label="Phone Number" name="phoneNumber" placeholder="e.g. 9876543210" />
          <FormGroup label="Address" name="address" placeholder="e.g. 123 Main Street, Delhi" />
        </>
      ),
    },
  ];

  const handleNext = async () => {
    const valid = await trigger(steps[step].fields);
    if (!valid) {
      toast.error('Please fix the errors before proceeding.');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFinalSubmit)} className="w-full max-w-md mx-auto">
        <Stepper steps={steps} step={step} setStep={setStep} onNext={handleNext} onBack={handleBack} />
      </form>
    </FormProvider>
  );
}
