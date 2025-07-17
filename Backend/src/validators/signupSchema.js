import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password is required'),
  businessName: z.string().min(1, 'Business name is required'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long'),
  address: z.string().min(1, 'Address is required').max(500),
});
