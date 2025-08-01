/* eslint-disable @typescript-eslint/no-explicit-any */


'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

import { registerUser, getMe } from '../../API/Api'
import Stepper from '../../components/Stepper'

const formSchema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Enter valid email'),
  password: z.string().min(8, 'Password must be 8+ chars'),
  phoneNumber: z.string().min(10, 'Phone must be 10+ digits'),
  address: z.string().min(2, 'Address required'),
})

type FormData = z.infer<typeof formSchema>

interface Props {
  onSubmit: () => void
}

export default function SignupStepperForm({ onSubmit }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)

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
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const handleFinalSubmit = async (data: FormData) => {
    const payload = {
      businessName: data.businessName,
      name: data.fullName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      address: data.address,
    }

    try {
      const res = await registerUser(payload)

      if (!res.success) {
        toast.error(res.message || 'Signup failed')
        return
      }

      toast.success('🎉 Registered successfully!')
      setTimeout(async () => {
        try {
          const user = await getMe()
          if (!user) throw new Error('User session not found')
          onSubmit?.()
          router.push('/dashboard')
        } catch (err) {
          console.log(err)
          toast.error('Auth check failed. Please login.')
          router.push('/')
        }
      }, 200)
    } catch (err: any) {
      if (err.response?.status === 409) {
         console.log(err)
        toast.error('Email already registered. Try logging in.')
        router.push('/login')
      } else {
        console.error('Registration error:', err)
        toast.error('Registration failed. Please try again.')
      }
    }
  }
  const FormGroup = ({
    label,
    name,
    type = 'text',
    placeholder,
  }: {
    label: string
    name: keyof FormData
    type?: string
    placeholder: string
  }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}*
      </label>
      <input
        id={name}
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="input w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  )

  const steps = [
    {
      label: 'Business Info',
      content: (
        <>
          <FormGroup label="Business Name" name="businessName" placeholder="e.g. Inkify Studio" />
          <FormGroup label="Full Name" name="fullName" placeholder="e.g. Jane Doe" />
        </>
      ),
    },
    {
      label: 'Account Info',
      content: (
        <>
          <FormGroup label="Email" name="email" type="email" placeholder="e.g. jane@example.com" />
          <FormGroup label="Password" name="password" type="password" placeholder="Create a strong password" />
        </>
      ),
    },
    {
      label: 'Contact Info',
      content: (
        <>
          <FormGroup label="Phone Number" name="phoneNumber" placeholder="e.g. 9876543210" />
          <FormGroup label="Address" name="address" placeholder="e.g. 123 Main Street, Delhi" />
        </>
      ),
    },
  ]

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFinalSubmit)} className="w-full max-w-md mx-auto">
        <Stepper steps={steps} step={step} setStep={setStep} />
      </form>
    </FormProvider>
  )
}
