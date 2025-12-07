import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonLabel,
  IonFab,
  IonFabButton,
  IonButton,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locateOutline,
  listOutline,
  restaurantOutline,
  beerOutline,
  calendarOutline,
  cafeOutline,
  fitnessOutline,
  star,
  navigateOutline,
  callOutline,
  arrowForwardOutline,
  closeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSearchbar,
    IonChip,
    IonIcon,
    IonLabel,
    IonFab,
    IonFabButton,
    IonButton,
    IonAvatar,
  ],
})
export class MapPage {
  selectedPlace: any = null;

  places = [
    {
      id: 101,
      name: 'Lumina Coffee',
      category: 'Cafetería',
      rating: 4.8,
      img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200',
      cover:
        'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600',
      desc: 'El mejor café de especialidad y espacio coworking.',
      top: '35%',
      left: '42%',
      color: '#d39e00', // Gold/Coffee
      icon: 'cafe-outline',
    },
    {
      id: 102,
      name: 'Burger Hype',
      category: 'Restaurante',
      rating: 4.5,
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200',
      cover:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600',
      desc: 'Hamburguesas artesanales y cervezas locales.',
      top: '55%',
      left: '65%',
      color: '#ed4956', // Red
      icon: 'restaurant-outline',
    },
    {
      id: 103,
      name: 'Vertex Gym',
      category: 'Fitness',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200',
      cover:
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600',
      desc: 'Entrena como un profesional. Abierto 24/7.',
      top: '25%',
      left: '20%',
      color: '#2f95dc', // Blue
      icon: 'fitness-outline',
    },
    {
      id: 104,
      name: 'Club 88',
      category: 'Bar & Fiesta',
      rating: 4.2,
      img: 'https://images.unsplash.com/photo-1514525253440-b393452de23e?q=80&w=200',
      cover:
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600',
      desc: 'La mejor música electrónica de la ciudad.',
      top: '65%',
      left: '30%',
      color: '#8338ec', // Purple
      icon: 'beer-outline',
    },
  ];

  constructor(private router: Router) {
    addIcons({
      locateOutline,
      listOutline,
      restaurantOutline,
      beerOutline,
      calendarOutline,
      cafeOutline,
      fitnessOutline,
      star,
      navigateOutline,
      callOutline,
      arrowForwardOutline,
      closeOutline,
    });
  }

  selectPlace(p: any) {
    this.selectedPlace = p;
  }

  closePreview() {
    this.selectedPlace = null;
  }

  goToProfile() {
    // Navigate to profile. In a real app we would pass the ID.
    // For this demo, ProfilePage automatically shows "Lumina Coffee" if isBusiness is true.
    this.router.navigate(['/tabs/profile']);
  }
}
