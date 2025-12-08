import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonFooter,
  IonSearchbar,
  ToastController,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  chatbubbleOutline,
  heart,
  heartOutline,
  paperPlaneOutline,
  ellipsisHorizontal,
  locationOutline,
  star,
  starOutline,
  sendOutline,
  ticketOutline,
  checkmarkCircleOutline,
  arrowRedoOutline,
} from 'ionicons/icons';
import { CommentsModalComponent } from '../components/comments-modal/comments-modal.component';
import { FeedService } from '../services/feed.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonAvatar,
    IonLabel,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonFooter,
    IonSearchbar,
  ],
})
export class HomePage implements OnInit {
  searchQuery = '';
  feedItems: any[] = [];

  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private feedService: FeedService
  ) {
    addIcons({
      notificationsOutline,
      chatbubbleOutline,
      heart,
      heartOutline,
      paperPlaneOutline,
      ellipsisHorizontal,
      locationOutline,
      star,
      starOutline,
      sendOutline,
      checkmarkCircleOutline,
      arrowRedoOutline,
      ticketOutline,
    });
  }

  ngOnInit() {
    this.feedService.getFeedItems().subscribe((items) => {
      this.feedItems = items;
    });
  }

  toggleLike(item: any) {
    item.liked = !item.liked;
    if (item.liked) {
      item.likes++;
    } else {
      item.likes--;
    }
  }

  async openComments(item: any) {
    const modal = await this.modalCtrl.create({
      component: CommentsModalComponent,
      componentProps: {
        postId: item.id,
      },
    });
    return await modal.present();
  }

  async share(item: any) {
    const toast = await this.toastCtrl.create({
      message: 'Compartido en tu perfil',
      duration: 2000,
      color: 'dark',
      icon: 'arrow-redo-outline',
    });
    await toast.present();
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    // La búsqueda local funcionará, pero idealmente deberíamos filtrar en el servicio
  }

  async openNotifications() {
    const toast = await this.toastCtrl.create({
      message: 'No tienes notificaciones nuevas',
      duration: 2000,
      color: 'dark',
      icon: 'notifications-outline',
    });
    await toast.present();
  }

  handleAction(item: any) {
    if (item.type === 'event') {
      this.toggleJoin(item);
    } else if (item.type === 'deal') {
      this.toastCtrl
        .create({
          message:
            '¡Oferta reclamada! Muestra este código: ' +
            Math.random().toString(36).substr(2, 6).toUpperCase(),
          duration: 3000,
          color: 'success',
          icon: 'ticket-outline',
          position: 'bottom',
        })
        .then((t) => t.present());
    } else {
      // Business action
      this.toastCtrl
        .create({
          message: 'Redirigiendo a ' + item.actionLabel + '...',
          duration: 2000,
          position: 'bottom',
        })
        .then((t) => t.present());
    }
  }

  toggleJoin(item: any) {
    item.going = !item.going;
    if (item.going) {
      item.attendees++;
      this.toastCtrl
        .create({
          message: '¡Te has apuntado al evento!',
          duration: 2000,
          color: 'success',
          icon: 'checkmark-circle-outline',
        })
        .then((t) => t.present());
    } else {
      item.attendees--;
    }
  }

  navigateToProfile(item: any) {
    // Determine profile type and ID based on item type
    let profileId: string;
    let profileType: string;

    if (item.type === 'post') {
      // Regular user post
      profileId = item.user;
      profileType = 'user';
    } else if (item.type === 'business' || item.type === 'deal') {
      // Business or deal
      profileId = item.name;
      profileType = 'business';
    } else if (item.type === 'event') {
      // Event - could be from a business or venue
      profileId = item.name || item.title;
      profileType = 'business'; // Events are usually from businesses
    } else {
      // Fallback
      profileId = item.user || item.name;
      profileType = 'user';
    }

    // Navigate to profile with type information (relative path within tabs)
    this.router.navigate(['../profile'], {
      relativeTo: this.route,
      queryParams: {
        id: profileId,
        type: profileType,
        itemType: item.type, // Original item type for context
      },
    });
  }
}
