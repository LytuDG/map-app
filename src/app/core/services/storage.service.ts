import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private supabase: SupabaseClient;

  // Buckets disponibles
  public readonly BUCKETS = {
    PROFILES: 'profiles',
    POSTS: 'posts',
    EVENTS: 'events',
  };

  constructor() {
    this.supabase = createClient(
      environment.supabase_url,
      environment.supabase_api_key
    );
  }

  /**
   * Sube un archivo a un bucket específico en Supabase Storage
   * @param file - Archivo a subir
   * @param bucket - Nombre del bucket ('profiles', 'posts', 'events')
   * @param path - Ruta opcional dentro del bucket (si no se especifica, se genera una automática)
   * @returns URL pública del archivo y path en storage
   */
  async uploadFile(
    file: File,
    bucket: string,
    path?: string
  ): Promise<UploadResult> {
    try {
      // Validar que el bucket sea válido (opcional, pero recomendado)
      if (
        !Object.values(this.BUCKETS).includes(bucket) &&
        bucket !== 'uploads'
      ) {
        console.warn(`Warning: Uploading to unknown bucket: ${bucket}`);
      }

      // Generar nombre único para el archivo si no se proporciona path
      let filePath = path;
      if (!filePath) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 9);
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}_${randomString}.${fileExt}`;
        filePath = fileName; // En bucket raíz, o agregar carpeta si se desea
      }

      // Subir archivo a Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading file to ${bucket}:`, error);
        return {
          url: '',
          path: '',
          error: error.message,
        };
      }

      // Obtener URL pública del archivo
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (error: any) {
      console.error('Error in uploadFile:', error);
      return {
        url: '',
        path: '',
        error: error.message || 'Error desconocido al subir archivo',
      };
    }
  }

  /**
   * Sube múltiples archivos
   * @param files - Array de archivos a subir
   * @param bucket - Nombre del bucket
   * @returns Array de resultados de subida
   */
  async uploadMultipleFiles(
    files: File[],
    bucket: string
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, bucket));
    return Promise.all(uploadPromises);
  }

  /**
   * Elimina un archivo de Supabase Storage
   * @param path - Path del archivo en storage
   * @param bucket - Nombre del bucket
   * @returns true si se eliminó correctamente
   */
  async deleteFile(path: string, bucket: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path]);

      if (error) {
        console.error(`Error deleting file from ${bucket}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return false;
    }
  }

  /**
   * Elimina múltiples archivos
   * @param paths - Array de paths de archivos
   * @param bucket - Nombre del bucket
   * @returns true si todos se eliminaron correctamente
   */
  async deleteMultipleFiles(paths: string[], bucket: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove(paths);

      if (error) {
        console.error(`Error deleting files from ${bucket}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteMultipleFiles:', error);
      return false;
    }
  }

  /**
   * Obtiene la URL pública de un archivo
   * @param path - Path del archivo en storage
   * @param bucket - Nombre del bucket
   * @returns URL pública del archivo
   */
  getPublicUrl(path: string, bucket: string): string {
    const {
      data: { publicUrl },
    } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  }

  /**
   * Sube una imagen optimizada (comprime antes de subir)
   * @param file - Archivo de imagen
   * @param bucket - Nombre del bucket ('profiles', 'posts', 'events')
   * @param maxWidth - Ancho máximo de la imagen (default: 1920)
   * @param quality - Calidad de compresión (0-1, default: 0.8)
   * @returns URL pública del archivo y path en storage
   */
  async uploadImage(
    file: File,
    bucket: string,
    maxWidth: number = 1920,
    quality: number = 0.8
  ): Promise<UploadResult> {
    try {
      // Comprimir imagen antes de subir
      const compressedFile = await this.compressImage(file, maxWidth, quality);
      return this.uploadFile(compressedFile, bucket);
    } catch (error: any) {
      console.error('Error in uploadImage:', error);
      return {
        url: '',
        path: '',
        error: error.message || 'Error al subir imagen',
      };
    }
  }

  /**
   * Comprime una imagen
   * @param file - Archivo de imagen
   * @param maxWidth - Ancho máximo
   * @param quality - Calidad (0-1)
   * @returns Archivo comprimido
   */
  private async compressImage(
    file: File,
    maxWidth: number,
    quality: number
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionar si es necesario
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Error al comprimir imagen'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Error al cargar imagen'));
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
    });
  }
}
