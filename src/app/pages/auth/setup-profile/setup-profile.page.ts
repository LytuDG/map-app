import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonSpinner,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonAvatar,
} from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { UploadResult } from 'src/app/core/services/storage.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-setup-profile',
  templateUrl: './setup-profile.page.html',
  styleUrls: ['./setup-profile.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonIcon,
    IonSpinner,
    IonTextarea,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonAvatar,
    FileUploadComponent,
  ],
})
export class SetupProfilePage implements OnInit {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode: 'setup' | 'edit' = 'setup';

  // Form Data
  accountType: 'user' | 'business' = 'user';
  username = '';
  bio = '';
  photoURL = '';
  photoPath = ''; // Para poder borrarla si se cambia

  isLoading = false;
  errorMessage = '';
  currentUserUid = '';

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.mode = (params['mode'] as 'setup' | 'edit') || 'setup';
    });

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserUid = user.uid;
        if (!this.username) {
          this.username = user.username;
        }
        if (!this.photoURL) {
          this.photoURL = user.photoURL;
        }
      }
    });
  }

  onAccountTypeChange(event: any) {
    this.accountType = event.detail.value;
  }

  onFileUploaded(result: UploadResult) {
    this.photoURL = result.url;
    this.photoPath = result.path;
  }

  async onSaveProfile() {
    if (!this.username || this.username.trim().length < 3) {
      this.errorMessage =
        'El nombre de usuario debe tener al menos 3 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // 1. Actualizar Auth Profile (Display Name y PhotoURL)
      // Nota: updateUsername que ya existía solo actualizaba username, aquí hacemos más
      // pero para mantener consistencia con el servicio, podríamos extenderlo o hacerlo aquí directo.
      // Haremos la actualización directa a Firestore para flexibilidad.

      const userRef = doc(this.firestore, 'users', this.currentUserUid);

      const updateData: any = {
        username: this.username.trim(),
        bio: this.bio.trim(),
        role: this.accountType,
        photoURL: this.photoURL,
        isProfileCompleted: true, // Flag para saber que ya pasó por aquí
      };

      if (this.photoPath) {
        updateData.photoPath = this.photoPath;
      }

      await updateDoc(userRef, updateData);

      // También actualizar el Auth profile básico si es posible
      // await this.authService.updateProfile({ displayName: this.username, photoURL: this.photoURL }); // Si existiera ese método

      if (this.mode === 'edit') {
        await this.router.navigate(['/profile']);
      } else {
        await this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      this.errorMessage = error.message || 'Error al guardar el perfil';
    } finally {
      this.isLoading = false;
    }
  }

  async onSkip() {
    // Marcar como completado aunque salte, para no volver a mostrarlo forzosamente
    // O simplemente ir al home
    await this.router.navigate(['/']);
  }
}
