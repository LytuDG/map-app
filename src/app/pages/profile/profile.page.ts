import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonTitle,
  IonSearchbar,
  IonThumbnail,
  ActionSheetController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  shareSocialOutline,
  globeOutline,
  timeOutline,
  callOutline,
  mapOutline,
  gridOutline,
  bookmarkOutline,
  searchOutline,
  add,
  personOutline,
  settingsOutline,
  helpCircleOutline,
  shieldOutline,
  logOutOutline,
} from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonIcon,
    IonAvatar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonTitle,
    IonSearchbar,
    IonThumbnail,
  ],
})
export class ProfilePage implements OnInit {
  isBusiness = false; // Toggle for demo purposes

  segment = 'posts';
  businessSegment = 'menu';
  searchTerm = '';

  userProfile = {
    username: 'sofia_m',
    name: 'Sofia Martinez',
    bio: 'Explorando la ciudad y el arte contemporáneo 🎨 | Coffee lover ☕',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    followers: 1240,
    following: 350,
    posts: 42,
    gallery: [
      'https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=400',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400',
      'https://images.unsplash.com/photo-1514525253440-b393452de23e?q=80&w=400',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=400',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?q=80&w=400',
    ],
  };

  businessProfile = {
    name: 'Lumina Coffee',
    category: 'Cafetería & Coworking',
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200',
    cover:
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800',
    info: 'El mejor café de especialidad en el centro. Espacio ideal para trabajar.',
    address: 'Calle 85 # 14-20, Bogotá',
    hours: 'Abierto hoy • 7:00 AM - 8:00 PM',
    menu: [
      {
        name: 'Cold Brew',
        price: '$4.50',
        desc: 'Infusionado por 12 horas',
        img: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7fa5b?q=80&w=300',
      },
      {
        name: 'Latte Art',
        price: '$3.80',
        desc: 'Leche texturizada suave',
        img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300',
      },
      {
        name: 'Avocado Toast',
        price: '$6.00',
        desc: 'Pan masa madre, aguacate hass',
        img: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?q=80&w=300',
      },
      {
        name: 'Cappuccino',
        price: '$4.00',
        desc: 'Clásico italiano',
        img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=300',
      },
      {
        name: 'Croissant',
        price: '$3.50',
        desc: 'Mantequilla francesa',
        img: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?q=80&w=300',
      },
    ],
    events: [
      {
        title: 'Cata de Café',
        date: 'Sábado, 10 AM',
        img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600',
        going: false,
      },
      {
        title: 'Brunch & Music',
        date: 'Domingo, 11 AM',
        img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600',
        going: true,
      },
    ],
    posts: [
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=400',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400',
      'https://images.unsplash.com/photo-1507133750069-bef72f3707a9?q=80&w=400',
    ],
  };

  filteredMenu = [...this.businessProfile.menu];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {
    addIcons({
      menuOutline,
      settingsOutline,
      shareSocialOutline,
      globeOutline,
      timeOutline,
      callOutline,
      mapOutline,
      gridOutline,
      bookmarkOutline,
      searchOutline,
      add,
      personOutline,
      helpCircleOutline,
      shieldOutline,
      logOutOutline,
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const profileType = params['type'];
      const profileId = params['id'];

      // Si no hay ID, es mi perfil
      if (!profileId) {
        this.loadOwnProfile();
      } else {
        // Cargar perfil ajeno (lógica existente o mock)
        if (profileType === 'business') {
          this.isBusiness = true;
        } else {
          this.isBusiness = false;
        }
        // TODO: Load actual other profile data
      }
    });
  }

  loadOwnProfile() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.isBusiness = user.role === 'business';

        // Actualizar datos del usuario
        this.userProfile = {
          ...this.userProfile, // Mantener datos mock que no tengamos (gallery)
          username: user.username,
          name: user.username, // O usar un campo 'name' si lo agregamos
          bio: user.bio || 'Sin biografía',
          img:
            user.photoURL ||
            'https://ui-avatars.com/api/?name=' + user.username,
          followers: user.followersCount || 0,
          following: user.followingCount || 0,
        };

        // Si es negocio, actualizar datos de negocio
        if (this.isBusiness && user.businessInfo) {
          this.businessProfile = {
            ...this.businessProfile,
            name: user.businessInfo.name || user.username,
            info: user.businessInfo.description || user.bio || '',
            address: user.businessInfo.address || '',
            // Mantener mocks para lo demás por ahora
          };
        } else if (this.isBusiness) {
          // Si es negocio pero no tiene info detallada, usar básicos
          this.businessProfile.name = user.username;
          this.businessProfile.info = user.bio || '';
        }
      }
    });
  }

  async openMenu() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      cssClass: 'profile-menu-action-sheet',
      buttons: [
        {
          text: 'Editar Perfil',
          icon: 'person-outline',
          handler: () => {
            console.log('Editar perfil');
            // TODO: Navigate to edit profile
          },
        },
        {
          text: 'Configuración',
          icon: 'settings-outline',
          handler: () => {
            console.log('Configuración');
            // TODO: Navigate to settings
          },
        },
        {
          text: 'Ayuda',
          icon: 'help-circle-outline',
          handler: () => {
            console.log('Ayuda');
            // TODO: Navigate to help
          },
        },
        {
          text: 'Privacidad',
          icon: 'shield-outline',
          handler: () => {
            console.log('Privacidad');
            // TODO: Navigate to privacy
          },
        },
        {
          text: 'Cerrar Sesión',
          icon: 'log-out-outline',
          role: 'destructive',
          handler: () => {
            this.confirmLogout();
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: '¿Cerrar sesión?',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      cssClass: 'logout-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          role: 'destructive',
          handler: async () => {
            await this.authService.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  toggleType() {
    this.isBusiness = !this.isBusiness;
  }

  filterMenu(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchTerm = query;
    if (query && query.trim() !== '') {
      this.filteredMenu = this.businessProfile.menu.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredMenu = [...this.businessProfile.menu];
    }
  }
}
