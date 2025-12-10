import { Timestamp } from '@angular/fire/firestore';

/**
 * Interfaz principal para comentarios
 * Colección: comments
 */
export interface Comment {
  commentId: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  authorPhoto: string;
  text: string;
  createdAt: Timestamp;
}

/**
 * Interfaz para crear un nuevo comentario
 */
export interface CreateCommentDto {
  postId: string;
  authorId: string;
  authorUsername: string;
  authorPhoto: string;
  text: string;
}

/**
 * Interfaz para actualizar un comentario existente
 */
export interface UpdateCommentDto {
  text: string;
}
