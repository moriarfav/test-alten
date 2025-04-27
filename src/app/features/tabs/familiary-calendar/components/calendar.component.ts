import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';

import { ModalController } from '@ionic/angular';
import { formatDate } from 'src/app/shared/utils/date-utils';
import { HolidaysApiService } from 'src/app/services/familiary-calendar/holidays/holidays-api.service';
import { Logger } from 'src/app/shared/utils/logger';
import { AddEventComponent } from './add-event.component';
import { CalendarService } from 'src/app/services/familiary-calendar/calendar-service';
import { FamilyEvent, FamilyMember } from 'src/app/models/family-events.model';
import { HolidayViewModel } from 'src/app/models/holiday.model';
import { APP_CONFIG, AppStatus } from 'src/app/app.constants';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  providers: [ModalController, CalendarService],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonSpinner,
    IonIcon,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonFab,
    IonFabButton,
    IonSelect,
    IonSelectOption,
    IonListHeader,
  ],
})
export class CalendarComponent implements OnInit {
  events: FamilyEvent[] = [];
  familyEvents: FamilyEvent[] = [];
  familyMembers: FamilyMember[] = [];
  filter: 'all' | 'holidays' | 'family' | undefined = 'all';
  holidays: HolidayViewModel[] = [];
  status: AppStatus = AppStatus.LOADING;
  errorMessage: string = '';
  selectedCountry: string = APP_CONFIG.defaultCountry;

  constructor(
    private modalController: ModalController,
    private calendarService: CalendarService
  ) {}

  async ngOnInit() {
    try {
      this.events = await this.calendarService.getMockEvents();
      this.familyMembers = await this.calendarService.getMockFamilyMembers();

      this.loadHolidays();

      this.familyEvents = this.events.filter((event) => !event.is_holiday);
      this.status = AppStatus.READY;
      localStorage.setItem('lastUpdate', new Date().toISOString());
    } catch (error) {
      this.status = AppStatus.ERROR;
      this.errorMessage = 'Failed to load calendar data';
      Logger.error('Calendar initialization error:', error);
    }
  }

  // Abrir el modal para añadir un evento familiar
  async openFamilyEventModal() {
    const modal = await this.modalController.create({
      component: AddEventComponent, // Componente para añadir eventos familiares
    });
    await modal.present();
    // Manejar los datos devueltos al cerrar el modal
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.familyEvents.push(data); // Añadir el evento a la lista de eventos familiares
      Logger.info('Family event added:', data);
    }
  }

  onFilterChange(filter: string | number | undefined): void {
    if (typeof filter === 'string' || filter === undefined) {
      this.filter =
        filter === 'all' ||
        filter === 'holidays' ||
        filter === 'family' ||
        filter === undefined
          ? filter || 'all'
          : 'all';
    } else {
      console.warn('Invalid filter value:', filter);
      this.filter = 'all'; // Valor predeterminado en caso de tipo no válido
    }
  }

  private loadHolidays() {
    HolidaysApiService.getHolidaysByCountry(this.selectedCountry)
      .then(async (holidays) => {
        if (holidays && holidays.length > 0) {
          this.holidays = holidays;

          this.addHolidaysToEvents();
        } else {
          this.holidays = HolidayViewModel.fromApiResponse(
            await this.calendarService.getMockHolidays()
          );
          Logger.info('Using mock holidays data');
        }
      })
      .catch(async (error) => {
        Logger.error('Failed to load holidays:', error);
        this.holidays = HolidayViewModel.fromApiResponse(
          await this.calendarService.getMockHolidays()
        );
      });
  }

  private addHolidaysToEvents() {
    const holidayEvents: FamilyEvent[] = this.holidays.map((holiday) => ({
      id: `holiday_${holiday.date}`,
      title: holiday.name,
      description:
        holiday.description || `${holiday.type} holiday in ${holiday.country}`,
      start_date: holiday.date,
      priority: 'medium',
      is_holiday: true,
      holiday_id: holiday.date,
    }));

    this.events = [...this.events, ...holidayEvents];
  }

  // Métodos para la plantilla
  changeCountry(country: string) {
    Logger.info('Country changed to:', country);

    this.selectedCountry = country;

    this.loadHolidays();
  }

  getCurrentMonthHolidays(): HolidayViewModel[] {
    const currentMonth = new Date().getMonth() + 1;
    return this.holidays.filter(
      (holiday) => parseInt(holiday.date_month) === currentMonth
    );
  }

  formatHolidayDate(holiday: HolidayViewModel): string {
    return `${holiday.date_day}/${holiday.date_month}/${holiday.date_year}`;
  }

  getEventsByMember(memberId: string): FamilyEvent[] {
    return this.events.filter(
      (event) => event.assigned_to && event.assigned_to.includes(memberId)
    );
  }

  addNewEvent(event: FamilyEvent) {
    if (!event.title || !event.start_date) {
      alert('Title and start date are required');
      return;
    }

    // Simular creación de evento
    setTimeout(() => {
      const newEvent = {
        ...event,
        id: 'evt_' + Date.now(),
      };
      this.events.push(newEvent);
      this.familyEvents.push(newEvent);
      alert('Event created successfully');
    }, 500);
  }

  formatEventDate(event: FamilyEvent): string {
    return formatDate(event.start_date);
  }

  filterHighPriorityEvents(): FamilyEvent[] {
    return this.events.filter((event) => event.priority === 'high');
  }
}
