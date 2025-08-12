import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'), // allow any valid email now
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .refine(
      (val) =>
        /[A-Z]/.test(val) && // at least 1 uppercase
        /[a-z]/.test(val) && // at least 1 lowercase
        /\d/.test(val) && // at least 1 number
        /[@$!%*?&]/.test(val),
      {
        message:
          'Password must contain uppercase, lowercase, number, and special character',
      }
    ),
  businessName: z.string().min(1, 'Business name is required'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  address: z.string().min(1, 'Address is required').max(500),
});
