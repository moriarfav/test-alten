import { getWeekDay } from '../shared/utils/date-utils';

export interface IHolidayApiResponse {
  name: string;
  country: string;
  location: string;
  type: string;
  date: string;
}

export class HolidayViewModel implements IHolidayApiResponse {
  name: string;
  description: string;
  country: string;
  location: string;
  type: string;
  date: string;
  date_year: string;
  date_month: string;
  date_day: string;
  week_day: string;

  constructor(apiHoliday: IHolidayApiResponse) {
    const dateParts = apiHoliday.date.split('-');

    this.name = apiHoliday.name;
    this.description = '';
    this.country = apiHoliday.country;
    this.location = 'All';
    this.type = this.determineHolidayType(apiHoliday.name);
    this.date = apiHoliday.date;
    this.date_year = dateParts[0];
    this.date_month = dateParts[1];
    this.date_day = dateParts[2];
    this.week_day = getWeekDay(apiHoliday.date);
  }

  private determineHolidayType(name: string): string {
    if (name.toLowerCase().includes('national')) {
      return 'National';
    } else if (name.toLowerCase().includes('regional')) {
      return 'Regional';
    } else {
      return 'Other';
    }
  }

  static fromApiResponse(
    apiHolidays: IHolidayApiResponse[]
  ): HolidayViewModel[] {
    return apiHolidays.map((holiday) => new HolidayViewModel(holiday));
  }
}
