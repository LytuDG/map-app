import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
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
} from 'ionicons/icons';

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

  constructor(private route: ActivatedRoute) {
    addIcons({
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
    });
  }

  ngOnInit() {
    // Read queryParams to determine profile type
    this.route.queryParams.subscribe((params) => {
      const profileType = params['type'];
      const profileId = params['id'];
      const itemType = params['itemType'];

      console.log('Profile params:', { profileType, profileId, itemType });

      // Set isBusiness based on type parameter
      if (profileType === 'business') {
        this.isBusiness = true;
      } else if (profileType === 'user') {
        this.isBusiness = false;
      }

      // TODO: Load actual profile data based on profileId
      // For now, we use the demo data
    });
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
