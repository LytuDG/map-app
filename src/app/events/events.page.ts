import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonChip,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  timeOutline,
  locationOutline,
  checkmarkCircle,
  heart,
  heartOutline,
  peopleOutline,
  mapOutline,
  ellipsisHorizontal,
  paperPlaneOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-events',
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonLabel,
    IonIcon,
    IonButton,
    IonSearchbar,
    IonChip,
    IonAvatar,
  ],
})
export class EventsPage {
  searchTerm = '';
  selectedCategory = 'all';

  categories = [
    { id: 'all', name: 'Todos' },
    { id: 'music', name: 'Música' },
    { id: 'food', name: 'Comida' },
    { id: 'art', name: 'Arte' },
    { id: 'party', name: 'Fiesta' },
  ];

  allEvents = [
    {
      id: 501,
      title: 'Festival de Food Trucks',
      category: 'food',
      date: 'Sáb, 12 Oct',
      time: '12:00 PM',
      location: 'Parque de la 93',
      distance: '2.5 km',
      attendees: 340,
      img: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?q=80&w=600',
      hostName: 'Bogotá Eats',
      hostImg:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150',
      going: false,
      liked: false,
      price: 'Gratis',
    },
    {
      id: 502,
      title: 'Noche de Comedia',
      category: 'art',
      date: 'Dom, 13 Oct',
      time: '8:00 PM',
      location: 'Teatro Central',
      distance: '1.2 km',
      attendees: 85,
      img: 'https://images.unsplash.com/photo-1585699324551-f6012dc017a9?q=80&w=600',
      hostName: 'Comedy Club',
      hostImg:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377de?q=80&w=150',
      going: true,
      liked: true,
      price: '$20.00',
    },
    {
      id: 503,
      title: 'Techno Rooftop Party',
      category: 'party',
      date: 'Vie, 18 Oct',
      time: '10:00 PM',
      location: 'Hotel B',
      distance: '500 m',
      attendees: 120,
      img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600',
      hostName: 'Hotel B Events',
      hostImg:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150',
      going: false,
      liked: false,
      price: '$15.00',
    },
    {
      id: 504,
      title: 'Exposición de Arte Moderno',
      category: 'art',
      date: 'Sáb, 19 Oct',
      time: '10:00 AM',
      location: 'Galería M',
      distance: '3.0 km',
      attendees: 45,
      img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600',
      hostName: 'Museo de Arte',
      hostImg:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150',
      going: false,
      liked: true,
      price: 'Gratis',
    },
    {
      id: 505,
      title: 'Concierto al Aire Libre',
      category: 'music',
      date: 'Dom, 20 Oct',
      time: '4:00 PM',
      location: 'Plaza Mayor',
      distance: '800 m',
      attendees: 500,
      img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600',
      hostName: 'Eventos Ciudad',
      hostImg:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
      going: false,
      liked: false,
      price: '$30.00',
    },
  ];

  filteredEvents = [...this.allEvents];

  constructor(private router: Router) {
    addIcons({
      paperPlaneOutline,
      timeOutline,
      locationOutline,
      peopleOutline,
      calendarOutline,
      checkmarkCircle,
      heart,
      heartOutline,
      mapOutline,
      ellipsisHorizontal,
    });
    this.filterEvents();
  }

  navigateToProfile(event: any) {
    this.router.navigate(['/profile'], {
      queryParams: {
        id: event.hostName,
        type: 'event',
      },
    });
  }

  toggleGoing(event: any) {
    event.going = !event.going;
  }

  toggleLike(event: any) {
    event.liked = !event.liked;
  }

  setCategory(catId: string) {
    this.selectedCategory = catId;
    this.filterEvents();
  }

  search(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterEvents();
  }

  filterEvents() {
    this.filteredEvents = this.allEvents.filter((e) => {
      // 1. Category Filter
      if (
        this.selectedCategory !== 'all' &&
        e.category !== this.selectedCategory
      )
        return false;

      // 2. Search Filter
      if (this.searchTerm && !e.title.toLowerCase().includes(this.searchTerm))
        return false;

      return true;
    });
  }
}
