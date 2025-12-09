import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-notifications-modal',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Notificaciones</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-vertical">
      <div class="notification-list">
        <div class="notification-item" *ngFor="let notif of notifications">
          <ion-avatar>
            <img [src]="notif.avatar" />
          </ion-avatar>
          <div class="content">
            <p>
              <span class="user">{{ notif.user }}</span> {{ notif.text }}
              <span class="time">{{ notif.time }}</span>
            </p>
          </div>
          <div class="media-preview" *ngIf="notif.media">
            <img [src]="notif.media" />
          </div>
          <div class="action-btn" *ngIf="notif.type === 'follow'">
            <ion-button
              size="small"
              [fill]="notif.following ? 'outline' : 'solid'"
              >{{ notif.following ? 'Siguiendo' : 'Seguir' }}</ion-button
            >
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      ion-toolbar {
        --background: white;
        --border-width: 0;
      }
      ion-title {
        font-weight: 700;
        font-size: 18px;
      }
      .notification-list {
        display: flex;
        flex-direction: column;
      }
      .notification-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        gap: 12px;

        ion-avatar {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
        }

        .content {
          flex: 1;
          font-size: 14px;
          line-height: 1.4;
          color: #262626;

          p {
            margin: 0;
          }
          .user {
            font-weight: 600;
            cursor: pointer;
          }
          .time {
            color: #8e8e8e;
            margin-left: 4px;
            font-size: 12px;
          }
        }

        .media-preview {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
          }
        }

        .action-btn {
          flex-shrink: 0;
        }
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class NotificationsModalComponent {
  notifications = [
    {
      user: 'luis.photo',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
      text: 'le gustó tu foto.',
      time: '2min',
      media:
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=100',
      type: 'like',
    },
    {
      user: 'cafe_central',
      avatar:
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=100',
      text: 'ha comenzado a seguirte.',
      time: '1h',
      following: false,
      type: 'follow',
    },
    {
      user: 'ana__g',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      text: 'comentó: "¡Increíble lugar! 😍"',
      time: '3h',
      media:
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=100',
      type: 'comment',
    },
  ];

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
