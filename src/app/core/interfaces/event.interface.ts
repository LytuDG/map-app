import { Timestamp } from '@angular/fire/firestore';
import { Location } from './user.interface';

/**
 * Interfaz principal para eventos
 * Colección: events
 */
export interface Event {
  eventId: string;
  title: string;
  description: string;
  imageUrl: string;
  date: Timestamp;
  placeId: string;
  location: Location;
  attendeesCount: number;
  createdAt: Timestamp;
}

/**
 * Interfaz para crear un nuevo evento
 */
export interface CreateEventDto {
  title: string;
  description: string;
  imageUrl: string;
  date: Date | Timestamp;
  placeId: string;
  location: Location;
}

/**
 * Interfaz para actualizar un evento existente
 */
export interface UpdateEventDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  date?: Date | Timestamp;
  placeId?: string;
  location?: Location;
}
