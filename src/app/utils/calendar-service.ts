import axios from 'axios';
import { Holiday, FamilyMember, FamilyEvent, APP_CONFIG } from './models';
import { Logger, AppErrorHandler } from './logger';
import { TokenManager } from './token-manager';
import { HolidaysApiService } from './holidays-api.service';

export class CalendarService {
  private baseUrl = 'https://public-holidays7.p.rapidapi.com';

  private apiKey = 'bd95842134msh83f3bb9bb772044p15b225jsn39f93bdc9976';

  constructor() {
  }

  public async getHolidays(country = APP_CONFIG.defaultCountry, year = new Date().getFullYear()): Promise<Holiday[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/`, {
        params: {
          api_key: this.apiKey,
          country: country,
          year: year
        }
      });

      Logger.info(`Retrieved ${response.data.length} holidays`);

      return response.data;
    } catch (error) {
      const errorData = AppErrorHandler.handleHttpError(error);
      Logger.error('Failed to get holidays', errorData);
      throw new Error('Failed to get holidays');
    }
  }

  public async fetchHolidaysForCountry(countryCode: string): Promise<Holiday[]> {
    try {
      const token = TokenManager.getToken();

      const headers = {
        'x-rapidapi-key': token,
        'x-rapidapi-host': 'public-holidays7.p.rapidapi.com'
      };

      const url = 'https://public-holidays7.p.rapidapi.com/';

      const year = 2025;

      const response = await axios.get(url, {
        params: {
          country: countryCode,
          year: year
        },
        headers: headers
      });

      return this.transformHolidayData(response.data);
    } catch (error) {
      console.error('Failed to fetch holidays:', error);

      return [];
    }
  }

  private transformHolidayData(data: any[]): Holiday[] {
    return data.map(item => ({
      name: item.name,
      description: '',
      country: item.country,
      location: 'All',
      type: 'Public',
      date: item.date,
      date_year: item.date.split('-')[0],
      date_month: item.date.split('-')[1],
      date_day: item.date.split('-')[2],
      week_day: this.getDayOfWeek(new Date(item.date))
    }));
  }

  private getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  public async getFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const familyData = [
        {
          id: '1',
          name: 'Juan García',
          role: 'Padre',
          country: 'ES',
          email: 'juan@example.com'
        },
        {
          id: '2',
          name: 'María López',
          role: 'Madre',
          country: 'ES',
          email: 'maria@example.com'
        },
        {
          id: '3',
          name: 'Luis García',
          role: 'Hijo',
          country: 'ES',
          email: 'luis@example.com'
        }
      ];

      return familyData;
    } catch (error) {
      Logger.error('Error fetching family members', error);
      return [];
    }
  }

  public async getHolidaysByMonth(month: string, country = APP_CONFIG.defaultCountry): Promise<Holiday[]> {
    try {
      const url = 'https://holidays.abstractapi.com/v1/';

      const response = await axios.get(url, {
        params: {
          api_key: this.apiKey,
          country: country,
          year: new Date().getFullYear().toString(),
          month: month
        }
      });

      return response.data;
    } catch (error) {
      AppErrorHandler.handleHttpError(error);
      throw new Error('Failed to get holidays by month');
    }
  }

  public async createFamilyEvent(event: FamilyEvent): Promise<FamilyEvent> {
    if (!event.title || !event.start_date) {
      Logger.error('Invalid event data', event);
      throw new Error('Event must have title and start date');
    }

    try {
      const newEvent = {
        ...event,
        id: 'event_' + new Date().getTime().toString()
      };

      Logger.info('Created new event', { id: newEvent.id });

      return newEvent;
    } catch (error) {
      AppErrorHandler.handleHttpError(error);
      throw new Error('Failed to create event');
    }
  }

  public async createEvent(event: FamilyEvent): Promise<FamilyEvent> {
    if (!event.title) {
      alert('Title is required');
      throw new Error('Title is required');
    }

    try {
      return {
        ...event,
        id: `evt_${Date.now()}`,
        created: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return event;
    }
  }

  public async updateFamilyEvent(id: string, eventData: Partial<FamilyEvent>): Promise<FamilyEvent> {
    try {
      const updatedEvent = {
        id,
        ...eventData,
        title: eventData.title || 'Sin título',
        start_date: eventData.start_date || new Date().toISOString()
      } as FamilyEvent;

      return updatedEvent;
    } catch (error) {
      Logger.error('Error updating event', error);
      throw error;
    }
  }

  public async deleteEvent(id: string): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      Logger.error('Error deleting event', error);
      return false;
    }
  }

  public notifyEventCreated(event: FamilyEvent): void {
    alert(`New event created: ${event.title}`);
    Logger.info('User notified of new event', { id: event.id });
  }

  public async getAllHolidays(countryCode: string): Promise<Holiday[]> {
    try {
      const staticServiceHolidays = await HolidaysApiService.getHolidaysByCountry(countryCode);

      if (staticServiceHolidays && staticServiceHolidays.length > 0) {
        return staticServiceHolidays;
      }

      const directHolidays = await this.getHolidays(countryCode);

      if (directHolidays && directHolidays.length > 0) {
        return directHolidays;
      }

      return this.fetchHolidaysForCountry(countryCode);
    } catch (error) {
      console.warn('Failed to get holidays from all sources:', error);

      return this.getMockHolidays();
    }
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
      }
    ];
  }
}
