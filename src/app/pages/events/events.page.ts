import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
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
import { FeedService } from 'src/app/core/services/feed.service';

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
export class EventsPage implements OnInit {
  searchTerm = '';
  selectedCategory = 'all';

  categories = [
    { id: 'all', name: 'Todos' },
    { id: 'music', name: 'Música' },
    { id: 'food', name: 'Comida' },
    { id: 'art', name: 'Arte' },
    { id: 'party', name: 'Fiesta' },
  ];

  allEvents: any[] = [];
  filteredEvents: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private feedService: FeedService
  ) {
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
  }

  ngOnInit() {
    this.feedService.getEventsItems().subscribe((events: any) => {
      this.allEvents = events;
      this.filterEvents();
    });
  }

  navigateToProfile(event: any) {
    // Events are typically hosted by businesses or venues
    this.router.navigate(['../profile'], {
      relativeTo: this.route,
      queryParams: {
        id: event.hostName,
        type: 'business',
        itemType: 'event',
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
