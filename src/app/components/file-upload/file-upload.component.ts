import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudUploadOutline,
  closeCircle,
  checkmarkCircle,
} from 'ionicons/icons';
import {
  StorageService,
  UploadResult,
} from '../../core/services/storage.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonSpinner],
  template: `
    <div class="file-upload-container">
      <!-- Upload Button -->
      <div class="upload-trigger" *ngIf="!isUploading && !uploadedFile">
        <input
          type="file"
          #fileInput
          [accept]="acceptedTypes"
          (change)="onFileSelected($event)"
          style="display: none"
        />
        <ion-button
          expand="block"
          (click)="fileInput.click()"
          [disabled]="disabled"
        >
          <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
          {{ buttonText }}
        </ion-button>
      </div>

      <!-- Loading State -->
      <div class="upload-loading" *ngIf="isUploading">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Subiendo archivo...</p>
      </div>

      <!-- Success State -->
      <div class="upload-success" *ngIf="uploadedFile && !error">
        <ion-icon name="checkmark-circle" color="success"></ion-icon>
        <div class="file-info">
          <p class="file-name">{{ uploadedFile.name }}</p>
          <a [href]="uploadedFile.url" target="_blank" class="file-url">
            Ver archivo
          </a>
        </div>
        <ion-button
          fill="clear"
          size="small"
          (click)="removeFile()"
          *ngIf="!disabled"
        >
          <ion-icon slot="icon-only" name="close-circle"></ion-icon>
        </ion-button>
      </div>

      <!-- Error State -->
      <div class="upload-error" *ngIf="error">
        <ion-icon name="close-circle" color="danger"></ion-icon>
        <p>{{ error }}</p>
        <ion-button size="small" (click)="retry()">Reintentar</ion-button>
      </div>
    </div>
  `,
  styles: [
    `
      .file-upload-container {
        width: 100%;
      }

      .upload-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 8px;

        p {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }
      }

      .upload-success {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #f0fdf4;
        border: 1px solid #86efac;
        border-radius: 8px;

        ion-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .file-info {
          flex: 1;
          min-width: 0;

          .file-name {
            margin: 0 0 0.25rem 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: #1a1a1a;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .file-url {
            font-size: 0.75rem;
            color: #16a34a;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .upload-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;

        ion-icon {
          font-size: 32px;
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          color: #991b1b;
          text-align: center;
        }
      }
    `,
  ],
})
export class FileUploadComponent {
  @Input() bucket: string = 'posts'; // Default bucket
  @Input() acceptedTypes: string = 'image/*';
  @Input() buttonText: string = 'Subir Archivo';
  @Input() disabled: boolean = false;
  @Input() compress: boolean = true; // Comprimir imágenes por defecto
  @Input() maxWidth: number = 1920;
  @Input() quality: number = 0.8;

  @Output() fileUploaded = new EventEmitter<UploadResult>();
  @Output() fileRemoved = new EventEmitter<void>();

  isUploading = false;
  uploadedFile: { name: string; url: string; path: string } | null = null;
  error: string = '';
  private lastFile: File | null = null;

  constructor(private storageService: StorageService) {
    addIcons({
      cloudUploadOutline,
      closeCircle,
      checkmarkCircle,
    });
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.lastFile = file;
    this.error = '';
    this.isUploading = true;

    try {
      let result: UploadResult;

      // Si es imagen y compress está activado, usar uploadImage
      if (this.compress && file.type.startsWith('image/')) {
        result = await this.storageService.uploadImage(
          file,
          this.bucket,
          this.maxWidth,
          this.quality
        );
      } else {
        result = await this.storageService.uploadFile(file, this.bucket);
      }

      if (result.error) {
        this.error = result.error;
        this.isUploading = false;
        return;
      }

      this.uploadedFile = {
        name: file.name,
        url: result.url,
        path: result.path,
      };

      this.fileUploaded.emit(result);
    } catch (err: any) {
      this.error = err.message || 'Error al subir archivo';
    } finally {
      this.isUploading = false;
    }
  }

  removeFile() {
    this.uploadedFile = null;
    this.error = '';
    this.lastFile = null;
    this.fileRemoved.emit();
  }

  retry() {
    if (this.lastFile) {
      this.onFileSelected({ target: { files: [this.lastFile] } });
    }
  }
}
