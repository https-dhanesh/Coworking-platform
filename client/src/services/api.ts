import axios from "axios";
import type { RegisterFormData, LoginFormData, CreateSpaceFormData } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const registerUser = async (data: RegisterFormData) => {
    const response = await api.post('/auth/register', data)
    return response.data;
}

export const loginUser = async (data: LoginFormData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
}

export const getAllSpaces = async (amenities: string = '') => {
  const params = amenities ? { amenities } : {};
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

export const updateSpace = async (id:string , data:CreateSpaceFormData)=>{
    const token = localStorage.getItem('token');
    const response = await api.put(`/spaces/${id}`,data,{
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

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

export const syncSpaceAmenities = async (spaceId: string , amenityIds:number[])=>{
    const token = localStorage.getItem('token');
    const response = await api.put(`/spaces/${spaceId}/amenities`,{amenityIds},{
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
}