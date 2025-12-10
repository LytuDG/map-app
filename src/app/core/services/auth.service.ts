import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import {
  BehaviorSubject,
  Observable,
  from,
  of,
  switchMap,
  map,
  catchError,
  tap,
  filter,
  take,
} from 'rxjs';
import { User, CreateUserDto } from '../interfaces';

const USER_STORAGE_KEY = 'user_session_data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // BehaviorSubject para mantener el estado actual del usuario
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  // Observable público del usuario
  currentUser$ = this.currentUserSubject.asObservable();

  // Observable del usuario autenticado de Firebase (interno)
  private firebaseUser$ = user(this.auth);

  // Estado de inicialización de la autenticación
  private authStateReady = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initUser();
  }

  private async initUser() {
    try {
      // 1. Intentar cargar usuario localmente para respuesta inmediata
      const localUser = await this.loadUserLocally();
      if (localUser) {
        this.currentUserSubject.next(localUser);
      }
    } catch (error) {
      console.error('Error init local user', error);
    } finally {
      // Marcar como listo después del chequeo local
      this.authStateReady.next(true);
    }

    // 2. Suscribirse a cambios de Firebase Auth para la fuente de verdad
    this.firebaseUser$
      .pipe(
        switchMap((firebaseUser) => {
          if (!firebaseUser) {
            return of(null);
          }
          return this.getUserData(firebaseUser.uid);
        })
      )
      .subscribe(async (user) => {
        this.currentUserSubject.next(user);

        if (user) {
          await this.saveUserLocally(user);
        } else {
          await this.clearUserLocally();
        }
      });
  }

  /**
   * Espera a que la autenticación inicial (carga local) termine
   */
  waitForAuthReady(): Observable<boolean> {
    return this.authStateReady.asObservable().pipe(
      filter((ready) => ready),
      take(1)
    );
  }

  // --- Local Storage Helpers ---

  private async saveUserLocally(user: User): Promise<void> {
    try {
      await Preferences.set({
        key: USER_STORAGE_KEY,
        value: JSON.stringify(user),
      });
    } catch (error) {
      console.error('Error saving user locally:', error);
    }
  }

  private async loadUserLocally(): Promise<User | null> {
    try {
      const { value } = await Preferences.get({ key: USER_STORAGE_KEY });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error loading user locally:', error);
      return null;
    }
  }

  private async clearUserLocally(): Promise<void> {
    try {
      await Preferences.remove({ key: USER_STORAGE_KEY });
    } catch (error) {
      console.error('Error clearing local user:', error);
    }
  }

  /**
   * Registra un nuevo usuario con email y contraseña
   */
  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Crear documento de usuario en Firestore
      const userData: CreateUserDto = {
        uid: userCredential.user.uid,
        email: email,
        username: email.split('@')[0], // Username temporal basado en email
        photoURL: `https://ui-avatars.com/api/?name=${
          email.split('@')[0]
        }&background=random`,
        role: 'user',
        bio: '',
      };

      await this.createUserDocument(userData);
      // Redirigir a setup-profile en lugar de home
      await this.router.navigate(['/auth/setup-profile']);
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      await this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Error en login:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Inicia sesión con Google (preparado para implementación futura)
   */
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);

      // Verificar si el usuario ya existe en Firestore
      const userDoc = await getDoc(
        doc(this.firestore, 'users', userCredential.user.uid)
      );

      if (!userDoc.exists()) {
        // Crear documento si es la primera vez que inicia sesión
        const userData: CreateUserDto = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          username: userCredential.user.displayName || 'Usuario',
          photoURL:
            userCredential.user.photoURL ||
            'https://ui-avatars.com/api/?name=User&background=random',
          role: 'user',
          bio: '',
        };

        await this.createUserDocument(userData);
        // Nuevo usuario: ir a setup-profile
        await this.router.navigate(['/auth/setup-profile']);
      } else {
        // Usuario existente: ir a home
        await this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos del usuario desde Firestore
   */
  private getUserData(uid: string): Observable<User | null> {
    return from(getDoc(doc(this.firestore, 'users', uid))).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data() as User;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error obteniendo datos del usuario:', error);
        return of(null);
      })
    );
  }

  /**
   * Crea el documento del usuario en Firestore
   */
  private async createUserDocument(userData: CreateUserDto): Promise<void> {
    const userRef = doc(this.firestore, 'users', userData.uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      followersCount: 0,
      followingCount: 0,
    });
  }

  /**
   * Actualiza el nombre de usuario
   */
  async updateUsername(username: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      // Actualizar en Firebase Auth
      await updateProfile(currentUser, { displayName: username });

      // Actualizar en Firestore
      const userRef = doc(this.firestore, 'users', currentUser.uid);
      await setDoc(userRef, { username }, { merge: true });
    } catch (error) {
      console.error('Error actualizando username:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => !!user));
  }

  /**
   * Maneja los errores de autenticación de Firebase
   */
  private handleAuthError(error: any): Error {
    let message = 'Ha ocurrido un error';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Este correo ya está registrado';
        break;
      case 'auth/invalid-email':
        message = 'Correo electrónico inválido';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operación no permitida';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/user-disabled':
        message = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/user-not-found':
        message = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-credential':
        message = 'Credenciales inválidas';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos. Intenta más tarde';
        break;
      default:
        message = error.message || 'Error de autenticación';
    }

    return new Error(message);
  }
}
