import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
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
  IonSpinner
} from '@ionic/angular/standalone';
import {APP_CONFIG, AppStatus, FamilyEvent, FamilyMember, formatDate, Holiday} from '../../utils/models';
import {HolidaysApiService} from '../../utils/holidays-api.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonSpinner,
    IonIcon, IonButton, IonSegment, IonSegmentButton, IonLabel,
    IonList, IonItem, IonFab, IonFabButton, IonSelect, IonSelectOption,
    IonListHeader
  ]
})
export class CalendarComponent implements OnInit {
  events: FamilyEvent[] = [];
  familyEvents: FamilyEvent[] = [];
  familyMembers: FamilyMember[] = [];
  holidays: Holiday[] = [];
  status: AppStatus = AppStatus.LOADING;
  errorMessage: string = '';
  selectedCountry: string = APP_CONFIG.defaultCountry;

  async ngOnInit() {
    try {
      this.events = this.getMockEvents();
      this.familyMembers = this.getMockFamilyMembers();
      
      this.loadHolidays();
      
      this.familyEvents = this.events.filter(event => !event.is_holiday);
      this.status = AppStatus.READY;
      localStorage.setItem('lastUpdate', new Date().toISOString());
    } catch (error) {
      this.status = AppStatus.ERROR;
      this.errorMessage = 'Failed to load calendar data';
      console.error('Calendar initialization error:', error);
    }
  }
  
  private loadHolidays() {
    HolidaysApiService.getHolidaysByCountry(this.selectedCountry)
      .then(holidays => {
        if (holidays && holidays.length > 0) {
          this.holidays = holidays;
          
          this.addHolidaysToEvents();
        } else {
          this.holidays = this.getMockHolidays();
          console.log('Using mock holidays data');
        }
      })
      .catch(error => {
        console.error('Failed to load holidays:', error);
        
        this.holidays = this.getMockHolidays();
      });
  }
  
  private addHolidaysToEvents() {
    const holidayEvents: FamilyEvent[] = this.holidays.map(holiday => ({
      id: `holiday_${holiday.date}`,
      title: holiday.name,
      description: holiday.description || `${holiday.type} holiday in ${holiday.country}`,
      start_date: holiday.date,
      priority: 'medium',
      is_holiday: true,
      holiday_id: holiday.date
    }));
    
    this.events = [...this.events, ...holidayEvents];
  }

  // Métodos para la plantilla
  changeCountry(country: string) {
    console.log('Country changed to:', country);
    
    this.selectedCountry = country;
    
    this.loadHolidays();
  }

  getCurrentMonthHolidays(): Holiday[] {
    const currentMonth = new Date().getMonth() + 1;
    return this.holidays.filter(
      holiday => parseInt(holiday.date_month) === currentMonth
    );
  }

  formatHolidayDate(holiday: Holiday): string {
    return `${holiday.date_day}/${holiday.date_month}/${holiday.date_year}`;
  }

  getEventsByMember(memberId: string): FamilyEvent[] {
    return this.events.filter(event =>
      event.assigned_to && event.assigned_to.includes(memberId)
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
        id: 'evt_' + Date.now()
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
    return this.events.filter(event => event.priority === 'high');
  }

  // Datos de muestra para desarrollo
  private getMockEvents(): FamilyEvent[] {
    return [
      {
        id: 'evt_1',
        title: 'Family Dinner',
        description: 'Dinner at grandma\'s house',
        start_date: '2025-04-20T18:00:00',
        end_date: '2025-04-20T21:00:00',
        assigned_to: ['mem_1', 'mem_2', 'mem_3'],
        priority: 'medium'
      },
      {
        id: 'evt_2',
        title: 'School Meeting',
        description: 'Parent-teacher conference',
        start_date: '2025-04-22T16:30:00',
        end_date: '2025-04-22T17:30:00',
        assigned_to: ['mem_2'],
        priority: 'high'
      },
      {
        id: 'evt_3',
        title: 'Movie Night',
        description: 'Watch the new superhero movie',
        start_date: '2025-04-26T20:00:00',
        end_date: '2025-04-26T22:30:00',
        assigned_to: ['mem_1', 'mem_3', 'mem_4'],
        priority: 'low'
      }
    ];
  }

  private getMockFamilyMembers(): FamilyMember[] {
    return [
      {
        id: 'mem_1',
        name: 'John Doe',
        role: 'Father',
        email: 'john.doe@example.com',
        country: 'US'
      },
      {
        id: 'mem_2',
        name: 'Jane Doe',
        role: 'Mother',
        email: 'jane.doe@example.com',
        country: 'US'
      },
      {
        id: 'mem_3',
        name: 'Jimmy Doe',
        role: 'Son',
        country: 'US'
      },
      {
        id: 'mem_4',
        name: 'Jenny Doe',
        role: 'Daughter',
        country: 'US'
      }
    ];
  }

  private getMockHolidays(): Holiday[] {
    return [
      {
        name: 'Labor Day',
        description: 'International Workers\' Day',
        country: 'ES',
        location: 'All',
        type: 'National',
        date: '2025-05-01',
        date_year: '2025',
        date_month: '05',
        date_day: '01',
        week_day: 'Thursday'
      },
      {
        name: 'Constitution Day',
        description: 'Spanish Constitution Day',
        country: 'ES',
        location: 'All',
        type: 'National',
        date: '2025-12-06',
        date_year: '2025',
        date_month: '12',
        date_day: '06',
        week_day: 'Saturday'
      },
      {
        name: 'Easter',
        description: 'Easter Sunday',
        country: 'ES',
        location: 'All',
        type: 'Religious',
        date: '2025-04-20',
        date_year: '2025',
        date_month: '04',
        date_day: '20',
        week_day: 'Sunday'
      }
    ];
  }
}
