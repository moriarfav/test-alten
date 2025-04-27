import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { CalendarComponent } from './components/calendar.component';

@Component({
  selector: 'app-familiary-calendar',
  templateUrl: 'familiary-calendar.page.html',
  styleUrls: ['familiary-calendar.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CalendarComponent],
})
export class FamiliaryCalendarPage {
  constructor() {}
}
