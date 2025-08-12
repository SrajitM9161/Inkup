/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { registerUser, getMe } from '../../API/Api';
import Stepper from '../../components/Stepper';

type FormData = {
  businessName: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
};

interface Props {
  onSubmit: () => void;
}

export default function SignupStepperForm({ onSubmit }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      businessName: '',
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
    },
  });

  const { register, handleSubmit, trigger, getValues } = methods;

  const handleFinalSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const res = await registerUser(data);

      if (!res.success) {
        if (res.errors) {
          Object.entries(res.errors).forEach(([field, msgs]) => {
            toast.error(
              `${field.charAt(0).toUpperCase() + field.slice(1)}: ${
                Array.isArray(msgs) ? msgs.join(', ') : msgs
              }`
            );
          });
        } else {
          toast.error(res.message || 'Signup failed');
        }
        setLoading(false);
        return;
      }

      toast.success('🎉 Registered successfully!');
      setTimeout(async () => {
        try {
          const user = await getMe();
          if (!user) throw new Error('User session not found');
          onSubmit?.();
          router.push('/dashboard');
        } catch {
          toast.error('Auth check failed. Please login.');
        }
      }, 200);
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.errors) {
        Object.entries(err.response.data.errors).forEach(([field, msgs]) => {
          toast.error(
            `${field.charAt(0).toUpperCase() + field.slice(1)}: ${
              Array.isArray(msgs) ? msgs.join(', ') : msgs
            }`
          );
        });
      } else if (err.response?.status === 409) {
        const message = err.response?.data?.message || '';
        if (message.toLowerCase().includes('phone')) {
          toast.error('Phone number already registered.');
        } else if (message.toLowerCase().includes('email')) {
          toast.error('Email already registered.');
        } else {
          toast.error('Duplicate entry. Please check your details.');
        }
      } else {
        console.error('Registration error:', err);
        toast.error(err.response?.data?.message || 'Something went wrong on the server.');
      }
    } finally {
      setLoading(false);
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
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-1"
        style={{ color: '#f8f8f8' }}
      >
        {label}*
      </label>
      <input
        id={name}
        {...register(name, {
          required: `${label} is required`,
          ...(name === 'email' && {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email must be valid',
            },
          }),
          ...(name === 'password' && {
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            validate: {
              hasUpper: (v) => /[A-Z]/.test(v) || 'Must contain uppercase letter',
              hasLower: (v) => /[a-z]/.test(v) || 'Must contain lowercase letter',
              hasNumber: (v) => /\d/.test(v) || 'Must contain number',
              hasSpecial: (v) => /[@$!%*?&]/.test(v) || 'Must contain special character',
            },
          }),
        })}
        type={type}
        placeholder={placeholder}
        className="input w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
        onBlur={() => {
          const val = getValues(name);
          const err = methods.formState.errors[name]?.message as string;
          if (err) toast.error(err);
        }}
      />
    </div>
  );

  const steps = [
    {
      label: 'Business Info',
      fields: ['businessName', 'name'] as (keyof FormData)[],
      content: (
        <>
          <FormGroup
            label="Business Name"
            name="businessName"
            placeholder="Enter Your Business Name"
          />
          <FormGroup label="Full Name" name="name" placeholder="Enter Your Full Name" />
        </>
      ),
    },
    {
      label: 'Account Info',
      fields: ['email', 'password'] as (keyof FormData)[],
      content: (
        <>
          <FormGroup label="Email" name="email" type="email" placeholder="Enter Your Email" />
          <FormGroup
            label="Password"
            name="password"
            type="password"
            placeholder="Enter Your Password"
          />
        </>
      ),
    },
    {
      label: 'Contact Info',
      fields: ['phoneNumber', 'address'] as (keyof FormData)[],
      content: (
        <>
          <FormGroup
            label="Phone Number"
            name="phoneNumber"
            placeholder="Enter Your Phone Number"
          />
          <FormGroup label="Address" name="address" placeholder="Enter Your Address" />
        </>
      ),
    },
  ];

  const handleNext = async () => {
    if (loading) return;
    const valid = await trigger(steps[step].fields);
    if (!valid) {
      const errs = methods.formState.errors;
      Object.values(errs).forEach((e) => {
        if (e?.message) toast.error(String(e.message));
      });
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (loading) return;
    setStep((prev) => prev - 1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFinalSubmit)} className="w-full max-w-md mx-auto">
        <Stepper
          steps={steps}
          step={step}
          setStep={setStep}
          onNext={handleNext}
          onBack={handleBack}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}
