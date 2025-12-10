import { Timestamp } from '@angular/fire/firestore';

/**
 * Interfaz principal para asistentes a eventos
 * Colección: event_attendees
 */
export interface EventAttendee {
  eventId: string;
  userId: string;
  createdAt: Timestamp;
}

/**
 * Interfaz para crear un nuevo asistente a evento
 */
export interface CreateEventAttendeeDto {
  eventId: string;
  userId: string;
}
