import axios from "axios";
import type { RegisterFormData, LoginFormData } from '../types';
import toast from 'react-hot-toast';

const api = axios.create({
  //  baseURL: 'http://localhost:5000/api'
    baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      toast.error("Session Expired. Please log in again.", { duration: 5000 });
      setTimeout(() => {
          window.location.href = '/login';
      }, 500); 
    }
    
    return Promise.reject(error);
  }
);

export const registerUser = async (data: RegisterFormData) => {
    const response = await api.post('/auth/register', data)
    return response.data;
}

export const loginUser = async (data: LoginFormData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
}

export const getAllSpaces = async (amenities: string = '', page: number = 1, search: string = '') => {
  const params = { 
    amenities: amenities || undefined,
    page,
    limit: 9,
    search: search || undefined, 
  };
  const response = await api.get('/spaces', { params });
  return response.data;
};

export const getSpaceById = async (id: string) => {
    const response = await api.get(`/spaces/${id}`);
    return response.data;
};

export const createSpace = async (data: FormData) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/spaces', data, {
        headers: {
            'Content-type':'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getMySpaces = async () =>{
    const token = localStorage.getItem('token');
    const response = await api.get('/spaces/my-spaces',{
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const updateSpace = async (id: string, data: FormData) => {
  const token = localStorage.getItem('token');
  const response = await api.put(`/spaces/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteSpace = async (id:string)=>{
    const token = localStorage.getItem('token');
    const response = await api.delete(`/spaces/${id}`,{
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getAllAmenities = async () => {
  const response = await api.get('/amenities');
  return response.data;
};

export const getAmenitiesForSpace = async (spaceId:string)=>{
    const response = await api.get(`/amenities/for-space/${spaceId}`);
    return response.data;
}

export const syncSpaceAmenities = async (spaceId: string , amenityIds:string[])=>{
    const token = localStorage.getItem('token');
    const response = await api.put(`/spaces/${spaceId}/amenities`,{amenityIds},{
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
}

export const getUserBookings = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/bookings/my-bookings', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getOwnerBookings = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/bookings/owner-history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createBooking = async (data: any) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/bookings', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; 
};

export const verifyPayment = async (data: any) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/bookings/verify-payment', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getReviewsBySpace = async (spaceId: string) => {
  const response = await api.get(`/reviews/${spaceId}`);
  return response.data;
};

export const submitReview = async (data: any) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/reviews', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};