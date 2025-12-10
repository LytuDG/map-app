import { Timestamp } from '@angular/fire/firestore';

/**
 * Interfaz principal para relaciones de seguimiento
 * Colección: follow
 */
export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: Timestamp;
}

/**
 * Interfaz para crear una nueva relación de seguimiento
 */
export interface CreateFollowDto {
  followerId: string;
  followingId: string;
}
