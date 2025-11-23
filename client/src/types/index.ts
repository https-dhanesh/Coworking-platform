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
  _id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  price_per_day: string;
  image_url?: string;
  amenities: Amenity[] | string[];
  total_slots: number;
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
  _id: string;
  name: string;
}

export interface Booking {
  _id: string;
  space_id: Space; 
  user_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booked_at: string;
}

export interface Review {
  _id: string;
  space_id: string;
  user_id: {
    _id: string;
    username: string;
    email: string;
  };
  rating: number;
  comment?: string;
  created_at: string;
}