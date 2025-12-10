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
  IonBadge,
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
  chatbubbleEllipsesOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { CommentsModalComponent } from 'src/app/components/comments-modal/comments-modal.component';
import { NotificationsModalComponent } from 'src/app/components/notifications-modal/notifications-modal.component';
import { FeedService } from 'src/app/core/services/feed.service';
import { UserService } from 'src/app/core/services/user.service';
import { LogoComponent } from 'src/app/components/logo/logo.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
    IonBadge,
    IonSearchbar,
    LogoComponent,
  ],
})
export class HomePage implements OnInit {
  searchQuery = '';
  feedItems: any[] = [];

  // Search state
  searchResults: any[] = [];
  isSearching = false;
  private searchTerms = new Subject<string>();

  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private feedService: FeedService,
    private userService: UserService
  ) {
    addIcons({
      notificationsOutline,
      chatbubbleEllipsesOutline,
      chevronForwardOutline,
      locationSharp,
      paperPlaneOutline,
      heartOutline,
      chatbubbleOutline,
      heart,
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
      // Solo actualizar feed si no estamos buscando, o siempre mantenerlo actualizado en background
      this.feedItems = items;
    });

    // Configurar pipeline de búsqueda
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.userService.searchUsers(term))
      )
      .subscribe((users) => {
        this.searchResults = users.map((user) => ({
          type: 'user-result',
          id: user.uid,
          user: user.username,
          userImg:
            user.photoURL ||
            `https://ui-avatars.com/api/?name=${user.username}`,
          desc: user.bio,
          role: user.role,
        }));
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title || item.user || 'Spotl',
          text: item.desc,
          url: window.location.href, // Or generate a deep link
        });
        return;
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }

    // Fallback if native share not supported or cancelled
    const toast = await this.toastCtrl.create({
      message: 'Enlace copiado al portapapeles',
      duration: 1500,
      color: 'dark',
      icon: 'checkmark-outline',
      position: 'bottom',
      cssClass: 'minimal-toast',
    });
    await toast.present();
  }

  onSearch(event: any) {
    const query = event.target.value;
    this.searchQuery = query;

    if (query && query.trim() !== '') {
      this.isSearching = true;
      this.searchTerms.next(query);
    } else {
      this.isSearching = false;
      this.searchResults = [];
    }
  }

  async openNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificationsModalComponent,
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
    });
    await modal.present();
  }

  goToMessages() {
    this.router.navigate(['/messages']);
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
    } else if (item.type === 'business') {
      // Navigate to business profile
      this.navigateToProfile(item);
    } else if (item.type === 'user-result') {
      // Navigate to user profile from search result
      this.navigateToProfile(item);
    } else {
      console.log('Action for item:', item);
    }
  }

  toggleJoin(item: any) {
    item.going = !item.going;
    if (item.going) {
      item.attendees++;
    } else {
      item.attendees--;
    }
  }

  navigateToProfile(item: any) {
    // Determine profile type and ID based on item type
    let profileId: string;
    let profileType: string;

    if (item.type === 'post') {
      profileId = item.user;
      profileType = 'user';
    } else if (item.type === 'business' || item.type === 'deal') {
      profileId = item.name;
      profileType = 'business';
    } else if (item.type === 'event') {
      profileId = item.name || item.title; // Adjust based on actual data structure
      profileType = 'business';
    } else if (item.type === 'user-result') {
      profileId = item.id;
      profileType = 'user'; // Or item.role if available
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
