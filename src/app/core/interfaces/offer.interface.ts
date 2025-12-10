import { Timestamp } from '@angular/fire/firestore';

/**
 * Interfaz principal para ofertas
 * Colección: offers
 */
export interface Offer {
  offerId: string;
  placeId: string;
  title: string;
  description: string;
  imageUrl: string;
  expiresAt: Timestamp;
}

/**
 * Interfaz para crear una nueva oferta
 */
export interface CreateOfferDto {
  placeId: string;
  title: string;
  description: string;
  imageUrl: string;
  expiresAt: Date | Timestamp;
}

/**
 * Interfaz para actualizar una oferta existente
 */
export interface UpdateOfferDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  expiresAt?: Date | Timestamp;
}
