import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonText,
  ToastController,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  heartOutline,
  compassOutline,
  mapOutline,
  calendarOutline,
  homeOutline,
  notificationsOutline,
  searchOutline,
  bookmarkOutline,
  timeOutline,
  star,
  heart,
  chatbubbleOutline,
  paperPlaneOutline,
  checkmarkCircle,
  peopleOutline,
  pricetagOutline,
} from 'ionicons/icons';
import { CommentsModalComponent } from '../components/comments-modal/comments-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonIcon,
    IonAvatar,
    IonText,
    IonButton,
  ],
})
export class HomePage implements OnInit {
  // Stories (Horizontal Scroll) remains distinct at top
  stories = [
    {
      name: 'Tu historia',
      img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      active: false,
      isUser: true,
    },
    {
      name: 'Café O.',
      img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=200',
      active: true,
    },
    {
      name: 'Yoga Spot',
      img: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=200',
      active: true,
    },
    {
      name: 'Bar 99',
      img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=200',
      active: true,
    },
    {
      name: 'Art Gal.',
      img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=200',
      active: false,
    },
  ];

  // Unified Feed Data
  feedItems: any[] = [
    {
      type: 'post',
      id: 1,
      user: 'sofia_m',
      userImg:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
      location: 'Museo de Arte Moderno',
      img: 'https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=800',
      likes: 234,
      desc: 'Increíble exposición de arte contemporáneo. ¡Tienen que venir! 🎨✨',
      liked: true,
    },
    {
      type: 'business',
      id: 101,
      name: 'Lumina Coffee',
      category: 'Cafetería • 0.2 km',
      userImg:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=150', // Logo placeholder
      rating: 4.8,
      img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800',
      desc: 'Ven a probar nuestro nuevo Cold Brew de temporada. ¡Te esperamos!',
      actionLabel: 'Ver Menú',
    },
    {
      type: 'event',
      id: 201,
      title: 'Jazz Night & Wine',
      date: 'HOY, 20:00',
      location: 'Blue Velvet Club',
      userImg:
        'https://images.unsplash.com/photo-1514525253440-b393452de23e?q=80&w=150', // Club logo
      attendees: 120,
      img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800',
      going: false,
      desc: 'Noche de jazz en vivo con los mejores saxofonistas de la ciudad.',
      actionLabel: 'Asistiré',
    },
    {
      type: 'post',
      id: 2,
      user: 'marcos_travel',
      userImg:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
      location: 'Parque Central',
      img: 'https://images.unsplash.com/photo-1496664444929-8c75efb9546f?q=80&w=800',
      likes: 89,
      desc: 'Tarde de relax y buena música en el parque. 🌳☀️',
      liked: false,
    },
    {
      type: 'deal',
      id: 301,
      name: 'Burger House',
      category: 'Oferta Flash',
      userImg:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=150',
      offer: '2x1 en Clásicas',
      time: 'Hasta las 22:00',
      img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800',
      color: '#FF6B6B',
      desc: '¡Aprovecha nuestra hora feliz! 2x1 en todas las hamburguesas clásicas.',
      actionLabel: 'Reclamar',
    },
    {
      type: 'business',
      id: 102,
      name: 'Vertex Gym',
      category: 'Fitness • 0.5 km',
      userImg:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=150',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800',
      desc: 'Matrícula gratis este mes. ¡Únete al movimiento healthy!',
      actionLabel: 'Más Info',
    },
  ];

  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    addIcons({
      locationOutline,
      heartOutline,
      compassOutline,
      mapOutline,
      calendarOutline,
      homeOutline,
      notificationsOutline,
      searchOutline,
      bookmarkOutline,
      timeOutline,
      star,
      heart,
      chatbubbleOutline,
      paperPlaneOutline,
      checkmarkCircle,
      peopleOutline,
      pricetagOutline,
    });
  }

  ngOnInit() {}

  toggleLike(item: any) {
    item.liked = !item.liked;
    if (item.likes !== undefined) {
      item.likes += item.liked ? 1 : -1;
    }
    this.showToast(item.liked ? 'Te gusta esto' : 'Ya no te gusta');
  }

  toggleJoin(item: any) {
    if (item.going !== undefined) {
      item.going = !item.going;
      const msg = item.going
        ? '¡Te has apuntado al evento!'
        : 'Has cancelado tu asistencia';
      this.showToast(msg);
    }
  }

  async handleAction(action: string) {
    if (action === 'comment') {
      const modal = await this.modalCtrl.create({
        component: CommentsModalComponent,
      });
      return await modal.present();
    } else if (action === 'share') {
      this.showToast('Compartir contenido...');
    } else {
      console.log('Action:', action);
    }
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'dark', // Minimalist toast
    });
    toast.present();
  }

  openNotifications() {
    console.log('Opening notifications...');
    this.showToast('No tienes notificaciones nuevas');
  }
}
