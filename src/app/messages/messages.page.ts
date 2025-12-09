import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  createOutline,
  cameraOutline,
  searchOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class MessagesPage implements OnInit {
  conversations = [
    {
      id: 1,
      name: 'Café Altura',
      avatar:
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=100',
      lastMessage: '¡Tu pedido está listo! ☕',
      time: '2m',
      unread: true,
    },
    {
      id: 2,
      name: 'Ana García',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      lastMessage: '¿Vamos al evento de jazz hoy?',
      time: '1h',
      unread: false,
    },
    {
      id: 3,
      name: 'Jazz & Blues Club',
      avatar:
        'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=100',
      lastMessage: 'Gracias por reservar tus entradas.',
      time: '3h',
      unread: false,
    },
    {
      id: 4,
      name: 'Carlos Ruiz',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      lastMessage: 'Jaja sí, estuvo increíble el lugar.',
      time: '1d',
      unread: false,
    },
  ];

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      createOutline,
      cameraOutline,
      searchOutline,
    });
  }

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/feed']);
  }
}
