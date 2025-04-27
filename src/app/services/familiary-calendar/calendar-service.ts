import axios from 'axios';
import { HolidayViewModel } from '../../models/holiday.model';
import { Logger } from '../../shared/utils/logger';
import { HolidaysApiService } from './holidays/holidays-api.service';
import { Subject } from 'rxjs';
import { FamilyEvent, FamilyMember } from 'src/app/models/family-events.model';
import { APP_CONFIG } from 'src/app/app.constants';

export class CalendarService {
  private eventCreatedSubject = new Subject<FamilyEvent>();
  eventCreated$ = this.eventCreatedSubject.asObservable();
  constructor() {}

  public async getHolidays(
    country = APP_CONFIG.defaultCountry,
    year = new Date().getFullYear()
  ): Promise<HolidayViewModel[]> {
    try {
      const response = await HolidaysApiService.getHolidays(country, year);

      if (response && response.length > 0) {
        return response;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error('Failed to get holidays');
    }
  }

  public async fetchHolidaysForCountry(
    countryCode: string
  ): Promise<HolidayViewModel[]> {
    try {
      const response = await HolidaysApiService.getHolidaysByCountry(
        countryCode
      );

      if (response && response.length > 0) {
        return response;
      } else {
        Logger.info('No holidays found for the given country');
        return [];
      }
    } catch (error) {
      Logger.error('Failed to fetch holidays:', error);

      return [];
    }
  }

  public async getMockFamilyMembers(): Promise<FamilyMember[]> {
    try {
      return axios
        .get<FamilyMember[]>('assets/mocks/family-members-mock.json')
        .then((response) => {
          if (response && response.data) {
            return response.data;
          } else {
            Logger.info('No family members found');
            return [];
          }
        });
    } catch (error) {
      Logger.error('Error fetching family members', error);
      return [];
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
        id: 'event_' + new Date().getTime().toString(),
      };

      Logger.info('Created new event', { id: newEvent.id });

      return newEvent;
    } catch (error) {
      Logger.error('Error creating event', error);
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
        created: new Date().toISOString(),
      };
    } catch (error) {
      Logger.error('Error creating event:', error);
      return event;
    }
  }

  public async updateFamilyEvent(
    id: string,
    eventData: Partial<FamilyEvent>
  ): Promise<FamilyEvent> {
    try {
      const updatedEvent = {
        id,
        ...eventData,
        title: eventData.title || 'Sin título',
        start_date: eventData.start_date || new Date().toISOString(),
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
    Logger.info('User notified of new event', { id: event.id });
    this.eventCreatedSubject.next(event);
  }

  public async getAllHolidays(
    countryCode: string
  ): Promise<HolidayViewModel[]> {
    try {
      const staticServiceHolidays =
        await HolidaysApiService.getHolidaysByCountry(countryCode);

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

  public async getMockHolidays(): Promise<HolidayViewModel[]> {
    try {
      return axios
        .get<HolidayViewModel[]>('assets/mocks/holidays-mock.json')
        .then((response) => {
          if (response && response.data) {
            return response.data;
          } else {
            Logger.info('No holidays found');
            return [];
          }
        });
    } catch (error) {
      Logger.error('Error fetching holidays', error);
      return [];
    }
  }

  public async getMockEvents(): Promise<FamilyEvent[]> {
    try {
      return axios
        .get<FamilyEvent[]>('assets/mocks/events-mock.json')
        .then((response) => {
          if (response && response.data) {
            return response.data;
          } else {
            Logger.info('No events found');
            return [];
          }
        });
    } catch (error) {
      Logger.error('Error fetching events', error);
      return [];
    }
  }
}
