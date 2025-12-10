import { Routes } from '@angular/router';
import { TabsPage } from './layout/tabs/tabs.page';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () =>
          import('./pages/auth/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        canActivate: [publicGuard],
        loadComponent: () =>
          import('./pages/auth/register/register.page').then(
            (m) => m.RegisterPage
          ),
      },
      {
        path: 'setup-profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/auth/setup-profile/setup-profile.page').then(
            (m) => m.SetupProfilePage
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./pages/map/map.page').then((m) => m.MapPage),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./pages/events/events.page').then((m) => m.EventsPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/messages/messages.page').then((m) => m.MessagesPage),
  },
];
