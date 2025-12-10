import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap } from 'rxjs/operators';

/**
 * Guard para proteger rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.waitForAuthReady().pipe(
    switchMap(() => authService.isAuthenticated()),
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
};

/**
 * Guard para rutas públicas (login, register)
 * Redirige al home si el usuario ya está autenticado
 */
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.waitForAuthReady().pipe(
    switchMap(() => authService.isAuthenticated()),
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
