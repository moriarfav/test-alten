import {
  HolidayViewModel,
  IHolidayApiResponse,
} from '../../../models/holiday.model';
import { HolidaysCache } from './holidays-cache';
import { Logger } from '../../../shared/utils/logger';
import axios from 'axios';
import { configureInterceptors } from 'src/app/services/interceptors/axios-interceptor';

const holidaysApiInstance = axios.create({
  baseURL: 'https://public-holidays7.p.rapidapi.com/',
  timeout: 10000,
});

configureInterceptors(holidaysApiInstance);

export class HolidaysApiService {
  public static async getHolidays(
    country: string,
    year: number
  ): Promise<HolidayViewModel[] | null> {
    const cachedHolidays = HolidaysCache.getHolidays(`${country}-${year}`);
    if (cachedHolidays) {
      Logger.info(`Using cached holidays data for ${country}, year: ${year}`);
      return cachedHolidays;
    }

    try {
      const response = await holidaysApiInstance.get(`${year}/${country}`);
      if (!response.data || response.data.length === 0) {
        Logger.warn(`No holidays found for ${country}, year: ${year}`);
        return [];
      }

      Logger.info(`Fetched holidays from API for ${country}, year: ${year}`);
      const transformedHolidays = HolidayViewModel.fromApiResponse(
        response.data
      );
      this.sortHolidaysByDate(transformedHolidays);

      if (transformedHolidays && transformedHolidays.length > 0) {
        HolidaysCache.cacheHolidays(country, transformedHolidays);
      }

      return transformedHolidays;
    } catch (error) {
      throw error;
    }
  }
  private static sortHolidaysByDate(holidays: HolidayViewModel[]): void {
    holidays.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  public static cacheHolidays(
    holidays: HolidayViewModel[],
    country: string
  ): void {
    try {
      localStorage.setItem(`holidays_${country}`, JSON.stringify(holidays));
    } catch (error) {
      Logger.error('Error caching holidays');
    }
  }

  public static async getHolidaysByCountry(
    countryCode: string
  ): Promise<HolidayViewModel[]> {
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
        Logger.error('Error parsing cached holidays:', error);
      }
    }
    try {
      const holidays = await this.getHolidays(
        countryCode,
        new Date().getFullYear()
      );

      if (holidays) {
        HolidaysCache.cacheHolidays(countryCode, holidays);
        localStorage.setItem(
          `holidays_${countryCode}`,
          JSON.stringify(holidays)
        );
      }
      return holidays || [];
    } catch (error) {
      return [];
    }
  }
}
