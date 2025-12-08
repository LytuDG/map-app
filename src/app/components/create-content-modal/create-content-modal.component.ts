import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonTextarea,
  IonItem,
  IonInput,
  IonCard,
  IonCardContent,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import {
  LucideAngularModule,
  X,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Send,
  Percent,
  FileText,
  CalendarDays,
  BadgePercent,
} from 'lucide-angular';

@Component({
  selector: 'app-create-content-modal',
  templateUrl: './create-content-modal.component.html',
  styleUrls: ['./create-content-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonTextarea,
    IonItem,
    IonInput,
    IonCard,
    IonCardContent,
  ],
})
export class CreateContentModalComponent {
  // Lucide icons
  readonly X = X;
  readonly ImageIcon = ImageIcon;
  readonly MapPin = MapPin;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Tag = Tag;
  readonly Send = Send;
  readonly Percent = Percent;
  readonly FileText = FileText;
  readonly CalendarDays = CalendarDays;
  readonly BadgePercent = BadgePercent;

  contentType: 'post' | 'event' | 'deal' = 'post';

  // Post fields
  postText = '';
  postImage: string | null = null;
  postLocation = '';

  // Event fields
  eventTitle = '';
  eventDescription = '';
  eventDate = '';
  eventTime = '';
  eventLocation = '';
  eventPrice = '';
  eventImage: string | null = null;

  // Deal fields
  dealTitle = '';
  dealDescription = '';
  dealPrice = '';
  dealOriginalPrice = '';
  dealLocation = '';
  dealImage: string | null = null;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  setContentType(type: 'post' | 'event' | 'deal') {
    this.contentType = type;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.contentType === 'post') {
          this.postImage = e.target.result;
        } else if (this.contentType === 'event') {
          this.eventImage = e.target.result;
        } else {
          this.dealImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async publish() {
    let isValid = false;
    let message = '';

    if (this.contentType === 'post') {
      isValid = this.postText.trim().length > 0;
      message = 'Post publicado exitosamente';
    } else if (this.contentType === 'event') {
      isValid = this.eventTitle.trim().length > 0 && this.eventDate.length > 0;
      message = 'Evento creado exitosamente';
    } else {
      isValid = this.dealTitle.trim().length > 0 && this.dealPrice.length > 0;
      message = 'Oferta publicada exitosamente';
    }

    if (!isValid) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor completa los campos requeridos',
        duration: 2000,
        color: 'warning',
        position: 'bottom',
      });
      await toast.present();
      return;
    }

    // Aquí iría la lógica para enviar al backend
    const contentData = this.getContentData();
    console.log('Publishing content:', contentData);

    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();

    this.modalCtrl.dismiss(contentData);
  }

  private getContentData() {
    if (this.contentType === 'post') {
      return {
        type: 'post',
        text: this.postText,
        image: this.postImage,
        location: this.postLocation,
      };
    } else if (this.contentType === 'event') {
      return {
        type: 'event',
        title: this.eventTitle,
        description: this.eventDescription,
        date: this.eventDate,
        time: this.eventTime,
        location: this.eventLocation,
        price: this.eventPrice,
        image: this.eventImage,
      };
    } else {
      return {
        type: 'deal',
        title: this.dealTitle,
        description: this.dealDescription,
        price: this.dealPrice,
        originalPrice: this.dealOriginalPrice,
        location: this.dealLocation,
        image: this.dealImage,
      };
    }
  }
}
