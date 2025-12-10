import { Timestamp } from '@angular/fire/firestore';
import { Location } from './user.interface';

/**
 * Tipos de posts disponibles en la aplicación
 */
export type PostType = 'user' | 'business' | 'event' | 'offer';

/**
 * Interfaz principal para posts
 * Colección: posts
 */
export interface Post {
  postId: string;
  authorId: string;
  authorUsername: string;
  authorPhoto: string;
  imageUrl: string;
  description: string;
  createdAt: Timestamp;
  likesCount: number;
  commentsCount: number;
  location?: Location;
  type: PostType;
}

/**
 * Interfaz para crear un nuevo post
 */
export interface CreatePostDto {
  authorId: string;
  authorUsername: string;
  authorPhoto: string;
  imageUrl: string;
  description: string;
  location?: Location;
  type: PostType;
}

/**
 * Interfaz para actualizar un post existente
 */
export interface UpdatePostDto {
  imageUrl?: string;
  description?: string;
  location?: Location;
}
