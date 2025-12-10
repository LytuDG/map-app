import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  orderBy,
  limit,
  startAt,
  endAt,
  setDoc,
  deleteDoc,
  increment,
} from '@angular/fire/firestore';
import { Observable, from, map, catchError, of } from 'rxjs';
import { User } from '../interfaces';
import { Follow, CreateFollowDto } from '../interfaces/follow.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);

  constructor() {}

  /**
   * Buscar usuarios por nombre de usuario (prefijo)
   * @param searchTerm Término de búsqueda
   * @returns Lista de usuarios coincidentes
   */
  searchUsers(searchTerm: string): Observable<User[]> {
    if (!searchTerm || searchTerm.trim() === '') {
      return of([]);
    }

    const term = searchTerm.toLowerCase();
    // Búsqueda simple por prefijo en username
    // Nota: Para búsquedas más complejas se recomienda Algolia o Typesense
    const usersRef = collection(this.firestore, 'users');
    const q = query(
      usersRef,
      where('username', '>=', term),
      where('username', '<=', term + '\uf8ff'),
      limit(20)
    );

    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data() as User);
      }),
      catchError((error) => {
        console.error('Error searching users:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener usuario por ID
   * @param uid ID del usuario
   * @returns Datos del usuario o null
   */
  getUserById(uid: string): Observable<User | null> {
    const userRef = doc(this.firestore, 'users', uid);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data() as User;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error getting user:', error);
        return of(null);
      })
    );
  }

  /**
   * Seguir a un usuario
   * @param followerId ID del usuario que sigue
   * @param followingId ID del usuario a seguir
   */
  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId)
      throw new Error('No puedes seguirte a ti mismo');

    const followRef = doc(
      this.firestore,
      'follows',
      `${followerId}_${followingId}`
    );
    const followerRef = doc(this.firestore, 'users', followerId);
    const followingRef = doc(this.firestore, 'users', followingId);

    try {
      await runTransaction(this.firestore, async (transaction) => {
        // Verificar si ya sigue (opcional, pero buena práctica)
        const followDoc = await transaction.get(followRef);
        if (followDoc.exists()) {
          throw new Error('Ya sigues a este usuario');
        }

        // Crear documento de relación
        const followData: Follow = {
          followerId,
          followingId,
          createdAt: serverTimestamp() as any,
        };
        transaction.set(followRef, followData);

        // Incrementar followingCount del seguidor
        transaction.update(followerRef, {
          followingCount: increment(1),
        });

        // Incrementar followersCount del seguido
        transaction.update(followingRef, {
          followersCount: increment(1),
        });
      });
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  /**
   * Dejar de seguir a un usuario
   * @param followerId ID del usuario que sigue
   * @param followingId ID del usuario a dejar de seguir
   */
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const followRef = doc(
      this.firestore,
      'follows',
      `${followerId}_${followingId}`
    );
    const followerRef = doc(this.firestore, 'users', followerId);
    const followingRef = doc(this.firestore, 'users', followingId);

    try {
      await runTransaction(this.firestore, async (transaction) => {
        const followDoc = await transaction.get(followRef);
        if (!followDoc.exists()) {
          throw new Error('No sigues a este usuario');
        }

        // Eliminar relación
        transaction.delete(followRef);

        // Decrementar followingCount
        transaction.update(followerRef, {
          followingCount: increment(-1),
        });

        // Decrementar followersCount
        transaction.update(followingRef, {
          followersCount: increment(-1),
        });
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  /**
   * Verificar si un usuario sigue a otro
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!followerId || !followingId) return false;

    const followRef = doc(
      this.firestore,
      'follows',
      `${followerId}_${followingId}`
    );
    const docSnap = await getDoc(followRef);
    return docSnap.exists();
  }
}
