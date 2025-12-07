import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  LucideAngularModule,
  Home,
  MapPin,
  Plus,
  Calendar,
  User,
} from 'lucide-angular';

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

  constructor() {}
}
