# Storage Service - Supabase Integration

Este servicio maneja la subida y gestión de archivos usando Supabase Storage. Los archivos se almacenan en Supabase y las URLs públicas se guardan en Firebase Firestore.

## Configuración

### 1. Credenciales de Supabase

Las credenciales ya están configuradas en `src/environments/environment.ts`:

```typescript
supabase_url: 'https://nnlxcvbobzmtchopglid.supabase.co',
supabase_api_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### 2. Crear Buckets en Supabase

Antes de usar el servicio, debes crear los siguientes buckets públicos en Supabase:

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Storage** en el menú lateral
3. Crea los siguientes buckets:
   - `profiles` (para fotos de perfil)
   - `posts` (para publicaciones)
   - `events` (para eventos)
4. Configúralos como **públicos** para que las URLs sean accesibles.

### 3. Políticas de Storage (RLS)

Debes configurar políticas para cada bucket. Ejemplo para acceso público:

```sql
-- Permitir lectura pública para todos los buckets
CREATE POLICY "Public Profiles Access" ON storage.objects FOR SELECT USING ( bucket_id = 'profiles' );
CREATE POLICY "Public Posts Access" ON storage.objects FOR SELECT USING ( bucket_id = 'posts' );
CREATE POLICY "Public Events Access" ON storage.objects FOR SELECT USING ( bucket_id = 'events' );

-- Permitir subida autenticada
CREATE POLICY "Auth Upload Profiles" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'profiles' AND auth.role() = 'authenticated' );
CREATE POLICY "Auth Upload Posts" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'posts' AND auth.role() = 'authenticated' );
CREATE POLICY "Auth Upload Events" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'events' AND auth.role() = 'authenticated' );
```

## Uso del Servicio

### Importar el Servicio

```typescript
import { StorageService } from "@core/services";

export class MyComponent {
  constructor(private storageService: StorageService) {}
}
```

### Subir un Archivo Simple

```typescript
async uploadFile(file: File) {
  // Especifica el bucket: 'posts', 'profiles', o 'events'
  const result = await this.storageService.uploadFile(file, 'posts');

  if (result.error) {
    console.error('Error:', result.error);
    return;
  }

  console.log('URL pública:', result.url);

  // Guardar la URL en Firebase Firestore
  await this.saveToFirestore(result.url, result.path);
}
```

### Subir una Imagen Optimizada

```typescript
async uploadProfileImage(file: File) {
  // Sube al bucket 'profiles'
  const result = await this.storageService.uploadImage(
    file,
    'profiles',
    800,        // ancho máximo
    0.9          // calidad
  );

  if (!result.error) {
    await this.updateUserProfile({ photoURL: result.url });
  }
}
```

### Subir Múltiples Archivos

```typescript
async uploadPostImages(files: File[]) {
  // Sube al bucket 'posts'
  const results = await this.storageService.uploadMultipleFiles(
    files,
    'posts'
  );

  // Filtrar solo los exitosos
  const successfulUploads = results.filter(r => !r.error);
  const urls = successfulUploads.map(r => r.url);

  // Guardar en Firebase
  await this.createPost({ images: urls });
}
```

### Eliminar un Archivo

```typescript
async deleteFile(path: string) {
  // Debes especificar el bucket
  const success = await this.storageService.deleteFile(path, 'posts');

  if (success) {
    console.log('Archivo eliminado');
    // Actualizar Firebase para remover la referencia
  }
}
```

### Obtener URL Pública

```typescript
getImageUrl(path: string): string {
  return this.storageService.getPublicUrl(path);
}
```

## Estructura de Carpetas Recomendada

Organiza tus archivos en carpetas según su tipo:

- `profiles/` - Fotos de perfil de usuarios
- `posts/` - Imágenes de posts
- `events/` - Imágenes de eventos
- `offers/` - Imágenes de ofertas
- `places/` - Imágenes de lugares/negocios
- `covers/` - Imágenes de portada

## Integración con Firebase

### Ejemplo: Crear Post con Imagen

```typescript
import { StorageService } from '@core/services';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

async createPost(imageFile: File, postData: any) {
  // 1. Subir imagen a Supabase
  const uploadResult = await this.storageService.uploadImage(
    imageFile,
    'posts'
  );

  if (uploadResult.error) {
    throw new Error(uploadResult.error);
  }

  // 2. Crear post en Firebase con la URL de Supabase
  const postRef = await addDoc(collection(this.firestore, 'posts'), {
    ...postData,
    imageUrl: uploadResult.url,
    imagePath: uploadResult.path, // Guardar path para poder eliminar después
    createdAt: serverTimestamp(),
  });

  return postRef.id;
}
```

### Ejemplo: Actualizar Perfil con Foto

```typescript
async updateProfilePhoto(userId: string, photoFile: File) {
  // 1. Subir nueva foto a Supabase
  const uploadResult = await this.storageService.uploadImage(
    photoFile,
    'profiles',
    800,  // Tamaño más pequeño para perfiles
    0.9
  );

  if (uploadResult.error) {
    throw new Error(uploadResult.error);
  }

  // 2. Obtener foto anterior del usuario
  const userDoc = await getDoc(doc(this.firestore, 'users', userId));
  const oldPhotoPath = userDoc.data()?.photoPath;

  // 3. Actualizar Firebase con nueva URL
  await updateDoc(doc(this.firestore, 'users', userId), {
    photoURL: uploadResult.url,
    photoPath: uploadResult.path,
  });

  // 4. Eliminar foto anterior de Supabase
  if (oldPhotoPath) {
    await this.storageService.deleteFile(oldPhotoPath);
  }
}
```

## Métodos Disponibles

### `uploadFile(file: File, folder: string): Promise<UploadResult>`

Sube un archivo a Supabase Storage.

### `uploadImage(file: File, folder: string, maxWidth?: number, quality?: number): Promise<UploadResult>`

Sube una imagen optimizada (comprimida).

### `uploadMultipleFiles(files: File[], folder: string): Promise<UploadResult[]>`

Sube múltiples archivos en paralelo.

### `deleteFile(path: string): Promise<boolean>`

Elimina un archivo de Supabase Storage.

### `deleteMultipleFiles(paths: string[]): Promise<boolean>`

Elimina múltiples archivos.

### `getPublicUrl(path: string): string`

Obtiene la URL pública de un archivo.

## Tipos

```typescript
interface UploadResult {
  url: string; // URL pública del archivo
  path: string; // Path en Supabase Storage
  error?: string; // Mensaje de error si falló
}
```

## Notas Importantes

1. **Bucket Name**: El servicio usa el bucket `spotl-media`. Asegúrate de crearlo en Supabase.

2. **URLs Públicas**: Las URLs generadas son públicas y accesibles sin autenticación.

3. **Nombres Únicos**: Los archivos se renombran automáticamente con timestamp + random string para evitar conflictos.

4. **Compresión de Imágenes**: El método `uploadImage()` comprime automáticamente las imágenes antes de subirlas.

5. **Limpieza**: Recuerda eliminar archivos de Supabase cuando elimines registros de Firebase para no acumular archivos huérfanos.

6. **Límites**: Verifica los límites de tu plan de Supabase (tamaño de archivos, ancho de banda, etc.).

## Próximos Pasos

- [ ] Crear bucket `spotl-media` en Supabase
- [ ] Configurar políticas de acceso (RLS)
- [ ] Integrar con componentes de subida de archivos
- [ ] Implementar limpieza automática de archivos huérfanos
- [ ] Agregar validación de tipos de archivo
- [ ] Implementar límites de tamaño de archivo
