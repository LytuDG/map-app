import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private feedItemsSubject = new BehaviorSubject<any[]>([
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
      timestamp: Date.now() - 3600000, // 1 hour ago
    },
    {
      type: 'business',
      id: 101,
      name: 'Lumina Coffee',
      category: 'Cafetería • 0.2 km',
      userImg:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=150',
      rating: 4.8,
      img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800',
      desc: 'Ven a probar nuestro nuevo Cold Brew de temporada. ¡Te esperamos!',
      actionLabel: 'Ver Menú',
      timestamp: Date.now() - 7200000,
    },
    {
      type: 'event',
      id: 201,
      title: 'Jazz Night & Wine',
      date: 'HOY, 20:00',
      location: 'Blue Velvet Club',
      userImg:
        'https://images.unsplash.com/photo-1514525253440-b393452de23e?q=80&w=150',
      attendees: 120,
      img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800',
      going: false,
      desc: 'Noche de jazz en vivo con los mejores saxofonistas de la ciudad.',
      actionLabel: 'Asistiré',
      timestamp: Date.now() - 10800000,
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
      timestamp: Date.now() - 14400000,
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
      timestamp: Date.now() - 18000000,
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
      timestamp: Date.now() - 21600000,
    },
  ]);

  private eventsItemsSubject = new BehaviorSubject<any[]>([
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
      timestamp: Date.now(),
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
      timestamp: Date.now(),
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
      timestamp: Date.now(),
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
      timestamp: Date.now(),
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
      timestamp: Date.now(),
    },
  ]);

  constructor() {}

  getFeedItems() {
    return this.feedItemsSubject.asObservable();
  }

  getEventsItems() {
    return this.eventsItemsSubject.asObservable();
  }

  addPost(data: any) {
    const newItem = {
      type: 'post',
      id: Date.now(),
      user: 'usuario_actual', // Placeholder
      userImg:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      location: data.location || 'Sin ubicación',
      img:
        data.image ||
        'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=800',
      likes: 0,
      desc: data.text,
      liked: false,
      timestamp: Date.now(),
    };

    const currentItems = this.feedItemsSubject.getValue();
    this.feedItemsSubject.next([newItem, ...currentItems]);
  }

  addEvent(data: any) {
    // Add to main feed (optional, but good for visibility)
    const feedEvent = {
      type: 'event',
      id: Date.now(),
      title: data.title,
      date: `${data.date} ${data.time || ''}`,
      location: data.location,
      userImg:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      attendees: 1,
      img:
        data.image ||
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800',
      going: true,
      desc: data.description,
      actionLabel: 'Asistiré',
      timestamp: Date.now(),
    };
    const currentFeed = this.feedItemsSubject.getValue();
    this.feedItemsSubject.next([feedEvent, ...currentFeed]);

    // Add to events list
    const eventItem = {
      id: Date.now(),
      title: data.title,
      category: 'party', // Default or selector
      date: data.date,
      time: data.time || '12:00 PM',
      location: data.location || 'Ubicación por definir',
      distance: '0.1 km',
      attendees: 1,
      img:
        data.image ||
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800',
      hostName: 'Usuario Actual',
      hostImg:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      going: true,
      liked: false,
      price: data.price ? `$${data.price}` : 'Gratis',
      timestamp: Date.now(),
    };

    const currentEvents = this.eventsItemsSubject.getValue();
    this.eventsItemsSubject.next([eventItem, ...currentEvents]);
  }

  addDeal(data: any) {
    const newItem = {
      type: 'deal',
      id: Date.now(),
      name: 'Usuario Actual',
      category: 'Oferta Flash',
      userImg:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      offer: data.title,
      time: 'Por tiempo limitado',
      img:
        data.image ||
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800',
      color: '#4CAF50', // Green for new deals
      desc: data.description,
      actionLabel: 'Reclamar',
      timestamp: Date.now(),
    };

    const currentItems = this.feedItemsSubject.getValue();
    this.feedItemsSubject.next([newItem, ...currentItems]);
  }
}
