export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export interface Space{
  id: number;
  owner_id: number;
  name: string;
  description: string;
  address: string;
  price_per_day: string;
  image_url?: string;
  created_at: string;
}

export type CreateSpaceFormData = {
  name: string;
  description: string;
  address: string;
  price_per_day: number;
  image?: FileList;
}

export interface Amenity{
  id: number;
  name: string;
}