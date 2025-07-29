'use client'
import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { registerUser, getMe } from '../../API/Api'
import Stepper from '../../components/Stepper'

const formSchema = z.object({
  businessName: z.string().min(2, "Business name required"),
  fullName: z.string().min(2, "Full name required"),
  email: z.string().email("Enter valid email"),
  password: z.string().min(8, "Password must be 8+ chars"),
  phoneNumber: z.string().min(10, "Phone must be 10+ digits"),
  address: z.string().min(2, "Address required"),
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

  const { register, handleSubmit, formState: { errors }, watch } = methods

  const handleFinalSubmit = async (data: FormData) => {
    try {
      const payload = {
        businessName: data.businessName,
        name: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        address: data.address,
      }

      const res = await registerUser(payload)

      if (res.success) {
        toast.success('🎉 Registered successfully!')
        setStep(steps.length - 1)

        // ✅ Wait for session cookie to be set
        setTimeout(async () => {
          try {
            const user = await getMe()
            if (user) {
              onSubmit?.()
              router.push('/dashboard')
            }
          } catch (e) {
            console.error('Auth check failed:', e)
            toast.error('Auth check failed. Please log in manually.')
            router.push('/')
          }
        }, 1000)
      } else {
        toast.error(res.message || 'Signup failed')
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("Email already registered. Try logging in.")
        router.push('/login')
      } else {
        console.error(err)
        toast.error('Registration failed. Try again.')
      }
    }
  }

  const steps = [
    {
      label: 'Business Info',
      content: (
        <>
          <label className="block text-sm">Business Name*</label>
          <input {...register('businessName')} className="input" placeholder="Business name" />
          {errors.businessName && <p className="text-red-400 text-xs">{errors.businessName.message}</p>}

          <label className="block text-sm mt-4">Full Name*</label>
          <input {...register('fullName')} className="input" placeholder="Full name" />
          {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName.message}</p>}
        </>
      ),
    },
    {
      label: 'Account Info',
      content: (
        <>
          <label className="block text-sm">Email*</label>
          <input {...register('email')} className="input" placeholder="Email" />
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}

          <label className="block text-sm mt-4">Password*</label>
          <input {...register('password')} className="input" type="password" placeholder="Password" />
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
        </>
      ),
    },
    {
      label: 'Contact Info',
      content: (
        <>
          <label className="block text-sm">Phone Number*</label>
          <input {...register('phoneNumber')} className="input" placeholder="Phone Number" />
          {errors.phoneNumber && <p className="text-red-400 text-xs">{errors.phoneNumber.message}</p>}

          <label className="block text-sm mt-4">Address*</label>
          <input {...register('address')} className="input" placeholder="Address" />
          {errors.address && <p className="text-red-400 text-xs">{errors.address.message}</p>}
        </>
      ),
    },
    {
      label: 'Success',
      content: (
        <div className="text-center">
          <div className="text-green-400 text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-semibold">Welcome, {watch('fullName')}</h2>
          <p className="text-cyan-400 text-sm">You’re now registered with Inkup</p>
        </div>
      ),
    },
  ]

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFinalSubmit)}>
        <Stepper
          steps={steps}
          step={step}
          setStep={setStep}
          onComplete={handleSubmit(handleFinalSubmit)}
        />
      </form>
    </FormProvider>
  )
}
