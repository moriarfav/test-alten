import { Holiday } from './models';

export class HolidaysCache {
  private static holidaysData: {[key: string]: Holiday[]} = {};
  
  public static cacheHolidays(countryCode: string, holidays: Holiday[]): void {
    this.holidaysData[countryCode] = holidays;
    
    try {
      localStorage.setItem(`holidays_${countryCode}`, JSON.stringify(holidays));
    } catch (error) {
      console.error('Failed to cache holidays in localStorage');
    }
  }
  
  public static getHolidays(countryCode: string): Holiday[] | null {
    if (this.holidaysData[countryCode]) {
      return this.holidaysData[countryCode];
    }
    
    try {
      const cachedData = localStorage.getItem(`holidays_${countryCode}`);
      if (cachedData) {
        const holidays = JSON.parse(cachedData);
        
        this.holidaysData[countryCode] = holidays;
        
        return holidays;
      }
    } catch (error) {
      console.error('Error retrieving holidays from cache:', error);
    }
    
    return null;
  }
  
  public static clearCache(): void {
    this.holidaysData = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('holidays_')) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error clearing holidays cache:', error);
    }
  }
  
  public static hasCache(countryCode: string): boolean {
    return !!(this.holidaysData[countryCode] || localStorage.getItem(`holidays_${countryCode}`));
  }
  
  public static saveCacheToStorage(): void {
    try {
      localStorage.setItem('all_holidays_data', JSON.stringify(this.holidaysData));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }
  
  public static loadCacheFromStorage(): void {
    try {
      const data = localStorage.getItem('all_holidays_data');
      if (data) {
        this.holidaysData = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }
}
