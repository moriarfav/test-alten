import { FamilyEvent } from '../models/family-calendar-model';

export function isValidEvent(event: FamilyEvent): boolean {
  return !!event.title && !!event.start_date;
}
