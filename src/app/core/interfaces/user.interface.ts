import { Timestamp } from '@angular/fire/firestore';

/**
 * Ubicación geográfica con latitud y longitud
 */
export interface Location {
  lat: number;
  lng: number;
}

/**
 * Información adicional para usuarios de tipo business
 */
export interface BusinessInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
}

/**
 * Roles de usuario disponibles en la aplicación
 */
export type UserRole = 'user' | 'business';

/**
 * Interfaz principal para usuarios
 * Colección: users
 */
export interface User {
  uid: string;
  username: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp;
  role: UserRole;
  bio?: string;
  followersCount: number;
  followingCount: number;
  location?: Location;
  businessInfo?: BusinessInfo;
}

/**
 * Interfaz para crear un nuevo usuario (sin campos autogenerados)
 */
export interface CreateUserDto {
  uid: string;
  username: string;
  email: string;
  photoURL: string;
  role: UserRole;
  bio?: string;
  location?: Location;
  businessInfo?: BusinessInfo;
}

/**
 * Interfaz para actualizar un usuario existente
 */
export interface UpdateUserDto {
  username?: string;
  photoURL?: string;
  bio?: string;
  location?: Location;
  businessInfo?: BusinessInfo;
}
