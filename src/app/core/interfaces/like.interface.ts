import { Timestamp } from '@angular/fire/firestore';

/**
 * Interfaz principal para likes
 * Colección: likes
 */
export interface Like {
  likeId: string;
  postId: string;
  userId: string;
  createdAt: Timestamp;
}

/**
 * Interfaz para crear un nuevo like
 */
export interface CreateLikeDto {
  postId: string;
  userId: string;
}
