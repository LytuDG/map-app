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
  locationSharp,
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
      locationSharp,
      paperPlaneOutline,
      chatbubbleOutline,
      heart,
      heartOutline,
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
      duration: 1500,
      color: 'dark',
      icon: 'arrow-redo-outline',
      position: 'bottom',
      cssClass: 'minimal-toast', // Use a custom class if we want to style it smaller later, but standard is fine for share
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

  handleAction(item: any, type?: string) {
    if (type === 'share') {
      this.share(item);
      return;
    }

    if (type === 'comment') {
      this.openComments(item);
      return;
    }

    // Main action button logic
    if (item.type === 'event') {
      this.toggleJoin(item);
    } else if (item.type === 'deal') {
      // Minimalist Claim Action
      item.claimed = !item.claimed;
      // No toast, just immediate UI feedback via the button state in template
    } else if (item.type === 'business') {
      // Navigate to business profile
      this.navigateToProfile(item);
    } else {
      // Fallback
      console.log('Action for item:', item);
    }
  }

  toggleJoin(item: any) {
    item.going = !item.going;
    if (item.going) {
      item.attendees++;
      // Minimalist: No toast, just state update
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
