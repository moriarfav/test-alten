import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./modules/family-calendar/calendar.component').then(m => m.CalendarComponent)
  }
];
