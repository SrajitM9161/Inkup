import axios from 'axios';
import { SignupFormInput } from '../Constants/Validation.schema';

export const registerUser = async (data: SignupFormInput) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, 
  });
  return response.data;
};
