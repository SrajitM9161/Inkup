import axios from 'axios';
import { ProjectFile } from '../(dashboard)/components/types/canvas'; 

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});


export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  businessName: string;
  address: string;
}) => {
  const response = await api.post('/register', data);
  return response.data;
};

// export const completeProfile = async (data: any) => {
//   const res = await axios.post(`/auth/complete-profile`, data, {
//     withCredentials: true, // important for cookies!
//   });
//   return res.data;
// };

export const updateMe = async (data: {
  businessName: string;
  phoneNumber: string;
  address: string;
}) => {
  const response = await api.patch('/me', data);
  return response.data;
};

export const getMe = async () => {
  const res = await api.get('/me');
  return res.data;
};



export const uploadUserImage = async (userFile: File) => {
  const formData = new FormData();
  formData.append('userImage', userFile);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/user-image`,
    formData,
    {
      withCredentials: true, 
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


export const uploadItemImage = async (itemFile: File) => {
  const formData = new FormData();
  formData.append('itemImage', itemFile);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/item-image`,
    formData,
    {
      withCredentials: true, 
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


export const generateTryonImage = async (
  humanBase64: string,
  tattooBase64: string,
  maskBase64: string
): Promise<string> => {
  const toFile = async (dataUrl: string, name: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], name, { type: 'image/png' });
  };

  const humanFile = await toFile(humanBase64, 'human.png');
  const tattooFile = await toFile(tattooBase64, 'tattoo.png');
  const maskFile = await toFile(maskBase64, 'mask.png');

  const formData = new FormData();
  formData.append('humanImage', humanFile);
  formData.append('tattooImage', tattooFile);
  formData.append('maskImage', maskFile);

  const res = await api.post('/api/tryon/tryon', formData, {
    withCredentials: true,
  });

  const generationId = res.data?.data?.generationId;
  if (!generationId) throw new Error('Generation failed, no ID returned');


  const imageRes = await api.get(`/api/tryon/image/${generationId}`, {
    withCredentials: true,
  });

  return imageRes.data?.data?.outputImageUrl;
};

export const uploadUserTattoos = async (tattooFiles: File[]) => {
  const formData = new FormData();
  tattooFiles.forEach((file) => {
    formData.append('tattoos', file); 
  });

  const response = await api.post('/api/tattoo/upload', formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};


export const getUserTattoos = async (page = 1, limit = 12) => {
  const res = await api.get(`/api/tattoo/my-tattoos?page=${page}&limit=${limit}`, {
    withCredentials: true,
  });
  return res.data;
};

export const editImages = async (prompt: string, images: string[]) => {
  const res = await api.post("/api/images/edit", { prompt, images });
  return res.data;
};

export const getUserEditOutputs = async (page = 1, limit = 20) => {
  const res = await api.get(`/api/user/outputs/edit?page=${page}&limit=${limit}`, {
    withCredentials: true,
  });
  return res.data;
};

const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};


interface UploadGenerationResponse {
  data: {
    generationId: string;
    assetId: string;
    imageUrl: string;
  }
} 

export const uploadGeneration = async (imageBase64: string): Promise<UploadGenerationResponse> => {
  const imageFile = await base64ToFile(imageBase64, 'generation.png');

  const formData = new FormData();
  formData.append('generation', imageFile); 

  const response = await api.post('/api/user/generations', formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

interface SaveProjectResponse {
  data: {
    _id: string;
    user: string;
    previewImageUrl: string;
    createdAt: string;
  }
}

export const saveProject = async (projectData: Partial<ProjectFile>, previewImageBase64: string): Promise<SaveProjectResponse> => {
  const previewImageFile = await base64ToFile(previewImageBase64, 'preview.png');

  const formData = new FormData();

  formData.append('previewImage', previewImageFile);
  
  // The backend controller expects the 'projectData' to be the nested object.
  // The getProjectData function in BrushCanvas is already creating this structure.
  // We just need to stringify it.
  formData.append('projectData', JSON.stringify(projectData.projectData));

  const response = await api.post('/api/user/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const getProjectById = async (projectId: string): Promise<{ data: ProjectFile }> => {
  const response = await api.get(`/api/user/projects/${projectId}`);
  console.log("API Response from getProjectById:", response.data);
  return response.data;
};

export default api;



