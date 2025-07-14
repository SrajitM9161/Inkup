import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  businessName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Too long')
    .optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  image: z.string().url('Image must be a valid URL').optional(), // ✅ add this
});

export type SignupFormInput = z.infer<typeof signupSchema>;
