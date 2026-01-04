
export enum Screen {
  SPLASH = 'splash',
  LOGIN = 'login',
  HOME = 'home',
  BOOKING = 'booking',
  PRODUCT_DETAIL = 'product_detail',
  PET_PROFILE = 'pet_profile'
}

export type UserRole = 'owner' | 'customer';

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category?: string;
}

export interface Booking {
  id: string;
  petName: string;
  service: string;
  date: string;
  time: string;
  status?: 'Confirmado' | 'Pendente' | 'Concluído';
}
