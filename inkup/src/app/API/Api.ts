import axios from 'axios';

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  businessName: string;
  address: string;
}) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
    data,
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
  return response.data;
};


export const getUserFromToken = async (): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Invalid token');

  const data = await res.json();
  return data.user;
};



export const uploadUserImage = async (
  userFile: File,
  token: string | null
) => {
  const formData = new FormData();
  formData.append('userImage', userFile);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/user-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


export const uploadItemImage = async (
  itemFile: File,
  token: string | null
) => {
  const formData = new FormData();
  formData.append('itemImage', itemFile);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/item-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};



const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMe = async () => {
  const res = await api.get('/me');
  return res.data;
};

export default api;
