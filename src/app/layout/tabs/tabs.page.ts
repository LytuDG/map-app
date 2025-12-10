import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import {
  LucideAngularModule,
  Home,
  MapPin,
  Plus,
  Calendar,
  User,
} from 'lucide-angular';
import { CreateContentModalComponent } from 'src/app/components/create-content-modal/create-content-modal.component';
import { FeedService } from 'src/app/core/services/feed.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, LucideAngularModule],
})
export class TabsPage {
  // Lucide icons
  readonly Home = Home;
  readonly MapPin = MapPin;
  readonly Plus = Plus;
  readonly Calendar = Calendar;
  readonly User = User;

  constructor(
    private modalCtrl: ModalController,
    private feedService: FeedService
  ) {}

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: CreateContentModalComponent,
      cssClass: 'create-content-modal',
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Content created:', data);

      if (data.type === 'post') {
        this.feedService.addPost(data);
      } else if (data.type === 'event') {
        this.feedService.addEvent(data);
      } else if (data.type === 'deal') {
        this.feedService.addDeal(data);
      }
    }
  }
}
