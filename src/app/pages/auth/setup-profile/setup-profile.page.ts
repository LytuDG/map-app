import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
  ],
})
export class SetupProfilePage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    // Obtener el email del usuario para sugerir un username
    this.authService.currentUser$.subscribe((user) => {
      if (user && !this.username) {
        this.username = user.username;
      }
    });
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
      await this.authService.updateUsername(this.username.trim());
      await this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al actualizar el perfil';
    } finally {
      this.isLoading = false;
    }
  }

  async onSkip() {
    await this.router.navigate(['/']);
  }
}
