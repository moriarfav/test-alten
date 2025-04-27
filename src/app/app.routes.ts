import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import(
        './features/tabs/familiary-calendar/components/calendar.component'
      ).then((m) => m.CalendarComponent),
  },
];
