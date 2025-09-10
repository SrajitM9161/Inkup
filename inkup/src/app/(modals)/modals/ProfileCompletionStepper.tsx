'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { updateMe } from '../../api/api'; 
import Stepper from '../../components/Stepper';

type FormData = {
  businessName: string;
  name: string; 
  email: string; 
  phoneNumber: string;
  address: string;
};

interface Props {
  initialData: {
    name: string;
    email: string;
  };
  onSuccess?: () => void;
}

export default function ProfileCompletionStepper({ initialData, onSuccess }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      ...initialData,
      businessName: '',
      phoneNumber: '',
      address: '',
    },
  });

  const { register, handleSubmit, trigger } = methods;

  const handleFinalSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { businessName, phoneNumber, address } = data;
      await updateMe({ businessName, phoneNumber, address });
      
      toast.success('🎉 Profile completed successfully!');
      onSuccess?.();
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const FormGroup = ({ label, name, placeholder, disabled = false }: { label: string; name: keyof FormData; placeholder: string; disabled?: boolean; }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1 text-gray-200">{label}*</label>
      <input
        id={name}
        {...register(name, { required: `${label} is required` })}
        placeholder={placeholder}
        className="input w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:opacity-70"
        disabled={loading || disabled}
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
          <FormGroup 
            label="Full Name" 
            name="name" 
            placeholder="Enter Your Full Name" 
            disabled={true}
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
          <FormGroup 
            label="Address" 
            name="address" 
            placeholder="Enter Your Address" 
          />
        </>
      ),
    },
  ];

  const handleNext = async () => {
    if (loading) return;
    const valid = await trigger(steps[step].fields);
    if (!valid) {
      toast.error('Please fill in all required fields.');
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