# Sistema de Autenticación Firebase

Este documento describe la implementación del sistema de autenticación con Firebase en la aplicación.

## 📁 Estructura

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts          # Guards de autenticación
│   │   └── index.ts
│   ├── interfaces/
│   │   ├── user.interface.ts      # Interfaces de usuario
│   │   └── ...                    # Otras interfaces
│   └── services/
│       ├── auth.service.ts        # Servicio de autenticación
│       └── index.ts
└── pages/
    └── auth/
        ├── login/
        │   ├── login.page.ts
        │   ├── login.page.html
        │   └── login.page.scss
        └── register/
            ├── register.page.ts
            ├── register.page.html
            └── register.page.scss
```

## 🔐 Características Implementadas

### 1. AuthService (`core/services/auth.service.ts`)

Servicio principal que maneja toda la lógica de autenticación:

- ✅ **Registro con email/password**: `register(email, password)`
- ✅ **Login con email/password**: `login(email, password)`
- ✅ **Login con Google**: `loginWithGoogle()` (preparado para implementación)
- ✅ **Logout**: `logout()`
- ✅ **Observables reactivos**: `user$` y `currentUser$`
- ✅ **Gestión de documentos en Firestore**: Crea automáticamente el perfil del usuario
- ✅ **Manejo de errores**: Traduce errores de Firebase a mensajes en español

### 2. Guards (`core/guards/auth.guard.ts`)

Dos guards para proteger rutas:

- **authGuard**: Protege rutas privadas (requiere autenticación)
- **publicGuard**: Protege rutas públicas (redirige si ya está autenticado)

### 3. Páginas de Autenticación

#### Login Page (`pages/auth/login/`)

- Formulario de email y contraseña
- Botón de Google (preparado)
- Toggle para mostrar/ocultar contraseña
- Manejo de errores con mensajes visuales
- Estados de carga
- Diseño profesional con gradientes y animaciones

#### Register Page (`pages/auth/register/`)

- Formulario de registro con confirmación de contraseña
- Validaciones en el cliente
- Botón de Google (preparado)
- Términos y condiciones
- Diseño profesional con gradientes y animaciones

## 🚀 Uso

### Proteger Rutas

```typescript
// En app.routes.ts
{
  path: 'profile',
  canActivate: [authGuard],  // Requiere autenticación
  loadComponent: () => import('./pages/profile/profile.page')
}

{
  path: 'auth/login',
  canActivate: [publicGuard],  // Solo para no autenticados
  loadComponent: () => import('./pages/auth/login/login.page')
}
```

### Usar el AuthService

```typescript
import { AuthService } from "@core/services";

export class MyComponent {
  private authService = inject(AuthService);

  // Obtener usuario actual
  user$ = this.authService.currentUser$;

  // Verificar autenticación
  isAuth$ = this.authService.isAuthenticated();

  // Cerrar sesión
  async logout() {
    await this.authService.logout();
  }
}
```

## 🎨 Diseño

Las páginas de autenticación incluyen:

- **Gradientes modernos**: Púrpura para login, rosa para register
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Animaciones**: Flotantes, pulso, shake, slide-up
- **Responsive**: Adaptable a todos los tamaños de pantalla
- **Feedback visual**: Estados de carga, errores, validaciones

## 🔄 Flujo de Autenticación

1. Usuario no autenticado intenta acceder a la app
2. `authGuard` redirige a `/auth/login`
3. Usuario se registra o inicia sesión
4. `AuthService` crea/valida credenciales en Firebase
5. Se crea/obtiene documento de usuario en Firestore
6. Usuario es redirigido a `/feed`
7. `publicGuard` previene acceso a páginas de auth

## 📝 Próximos Pasos

- [ ] Implementar autenticación con Google
- [ ] Agregar recuperación de contraseña
- [ ] Implementar actualización de perfil
- [ ] Agregar verificación de email
- [ ] Implementar cambio de contraseña
- [ ] Agregar autenticación con más proveedores (Facebook, Apple)

## 🔧 Configuración

La configuración de Firebase se encuentra en:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Los providers de Firebase están configurados en:

- `src/main.ts`

## 📚 Interfaces

Las interfaces de usuario están en `core/interfaces/user.interface.ts`:

```typescript
interface User {
  uid: string;
  username: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp;
  role: "user" | "business";
  bio?: string;
  followersCount: number;
  followingCount: number;
  location?: Location;
  businessInfo?: BusinessInfo;
}
```
