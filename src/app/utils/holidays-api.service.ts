import axios from 'axios';
import { environment } from '../../environments/environment';
import { Holiday } from './models';
import { TokenManager } from './token-manager';
import { HolidaysCache } from './holidays-cache';

export class HolidaysApiService {
  private static baseUrl = 'https://public-holidays7.p.rapidapi.com/';

  public static async getHolidays(country: string, year: number) {
    const cachedHolidays = HolidaysCache.getHolidays(country);
    if (cachedHolidays) {
      console.log('Using cached holidays data for', country);
      return cachedHolidays;
    }
    try {
      if (!this.checkTokenValidity()) {
        await TokenManager.refreshToken();
      }

      const token = TokenManager.getToken();

      const headers = TokenManager.getAuthHeaders();

      const response = await axios.get(this.baseUrl + year + '/'+ country, {
        headers: headers
      });

      const transformedHolidays = this.transformHolidays(response.data);

      if (transformedHolidays && transformedHolidays.length > 0) {
        HolidaysCache.cacheHolidays(country, transformedHolidays);
      }

      return transformedHolidays;
    } catch (error) {
      console.error('Error fetching holidays:', error);

      return null;
    }
  }

  private static checkTokenValidity(): boolean {
    const isValid = TokenManager.isTokenValid();

    if (!isValid) {
      TokenManager.refreshToken();

      localStorage.setItem('token_last_check', new Date().toISOString());

      return true;
    }

    return isValid;
  }

  private static transformHolidays(apiHolidays: any[]): Holiday[] {
    const holidays: Holiday[] = [];

    for (let i = 0; i < apiHolidays.length; i++) {
      const holiday = apiHolidays[i];

      const dateParts = holiday.date.split('-');

      holidays.push({
        name: holiday.name,
        description: '',
        country: holiday.country,
        location: 'All',
        type: this.determineHolidayType(holiday.name),
        date: holiday.date,
        date_year: dateParts[0],
        date_month: dateParts[1],
        date_day: dateParts[2],
        week_day: this.getWeekDay(holiday.date)
      });
    }

    this.sortHolidaysByDate(holidays);

    return holidays;
  }

  private static sortHolidaysByDate(holidays: Holiday[]): void {
    for (let i = 0; i < holidays.length; i++) {
      for (let j = i + 1; j < holidays.length; j++) {
        if (holidays[i].date > holidays[j].date) {
          const temp = holidays[i];
          holidays[i] = holidays[j];
          holidays[j] = temp;
        }
      }
    }
  }

  private static determineHolidayType(name: string): string {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('christmas') || lowerName.includes('easter')) {
      return 'Religious';
    } else if (lowerName.includes('independence') || lowerName.includes('national')) {
      return 'National';
    } else {
      return 'Public';
    }
  }

  private static getWeekDay(dateString: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  }

  public static cacheHolidays(holidays: Holiday[], country: string): void {
    try {
      localStorage.setItem(`holidays_${country}`, JSON.stringify(holidays));
    } catch (error) {
      console.log('Error caching holidays');
    }
  }

  public static async getHolidaysByCountry(countryCode: string): Promise<Holiday[]> {
    if (HolidaysCache.hasCache(countryCode)) {
      const cachedData = HolidaysCache.getHolidays(countryCode);
      if (cachedData) {
        return cachedData;
      }
    }

    const cachedHolidays = localStorage.getItem(`holidays_${countryCode}`);
    if (cachedHolidays) {
      try {
        const parsedHolidays = JSON.parse(cachedHolidays);

        HolidaysCache.cacheHolidays(countryCode, parsedHolidays);

        return parsedHolidays;
      } catch (error) {
        console.error('Error parsing cached holidays:', error);
      }
    }

    const holidays = await this.getHolidays(countryCode, 2025);

    if (holidays) {
      HolidaysCache.cacheHolidays(countryCode, holidays);
      localStorage.setItem(`holidays_${countryCode}`, JSON.stringify(holidays));
    }

    return holidays || [];
  }
}
