import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonItem,
  IonAvatar,
  IonFooter,
  IonInput,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';

@Component({
  selector: 'app-comments-modal',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Comentarios</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <span style="font-weight: 600;">Cerrar</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="comments-list">
        <div class="comment-item" *ngFor="let c of comments">
          <ion-avatar slot="start">
            <img [src]="c.img" />
          </ion-avatar>
          <div class="comment-content">
            <p>
              <span class="username">{{ c.user }}</span>
              {{ c.text }}
            </p>
            <span class="time">{{ c.time }}</span>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-item lines="none" class="input-item">
          <ion-avatar slot="start" class="my-avatar">
            <img
              src="https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=150"
            />
          </ion-avatar>
          <ion-input
            placeholder="Añade un comentario..."
            [(ngModel)]="newComment"
            (keyup.enter)="addComment()"
          ></ion-input>
          <ion-button
            fill="clear"
            slot="end"
            (click)="addComment()"
            [disabled]="!newComment.trim()"
          >
            <ion-icon name="send"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [
    `
      ion-toolbar {
        --background: white;
      }
      .comments-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .comment-item {
        display: flex;
        gap: 10px;
        ion-avatar {
          width: 32px;
          height: 32px;
        }
        .comment-content {
          flex: 1;
          p {
            font-size: 13px;
            line-height: 1.4;
            margin: 0;
            color: #333;
          }
          .username {
            font-weight: 700;
            margin-right: 4px;
          }
          .time {
            font-size: 11px;
            color: #999;
            margin-top: 4px;
            display: block;
          }
        }
      }
      .input-item {
        --background: #f4f5f8;
        --border-radius: 24px;
        margin: 10px;
        --padding-start: 8px;
        ion-input {
          --padding-start: 8px;
          font-size: 14px;
        }
        .my-avatar {
          width: 28px;
          height: 28px;
          margin-right: 8px;
        }
        ion-button {
          --color: #3880ff;
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonItem,
    IonAvatar,
    IonFooter,
    IonInput,
    IonIcon,
  ],
})
export class CommentsModalComponent {
  @Input() postId: any;

  comments = [
    {
      user: 'carlos_99',
      text: '¡Se ve genial! 🔥',
      time: '2m',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=150',
    },
    {
      user: 'ana_art',
      text: 'Me encanta este lugar 😍',
      time: '15m',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
    },
    {
      user: 'juan_p',
      text: '¿A qué hora abren?',
      time: '1h',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    },
  ];

  newComment = '';

  constructor(private modalCtrl: ModalController) {
    addIcons({ send });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.comments.push({
      user: 'sofia_m', // Current User
      text: this.newComment,
      time: 'Ahora',
      img: 'https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=150',
    });
    this.newComment = '';
  }
}
