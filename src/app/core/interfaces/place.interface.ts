import { Timestamp } from '@angular/fire/firestore';
import { Location } from './user.interface';

/**
 * Interfaz principal para lugares/negocios
 * Colección: places
 */
export interface Place {
  placeId: string;
  ownerId: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  location: Location;
  createdAt: Timestamp;
}

/**
 * Interfaz para crear un nuevo lugar
 */
export interface CreatePlaceDto {
  ownerId: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  location: Location;
}

/**
 * Interfaz para actualizar un lugar existente
 */
export interface UpdatePlaceDto {
  name?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  location?: Location;
}
