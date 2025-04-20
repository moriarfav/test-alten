// Modelo de Holiday (día festivo)
export interface Holiday {
  name: string;
  name_local?: string;
  language?: string;
  description?: string;
  country: string;
  location: string;
  type: string;
  date: string;
  date_year: string;
  date_month: string;
  date_day: string;
  week_day: string;
}

// Modelo para perfiles de familia
export interface FamilyMember {
  id?: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  phone?: string;
  country?: string; // País para ver días festivos relevantes
}

// Modelo de Evento personalizado
export interface FamilyEvent {
  id?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  assigned_to?: string[];
  created_by?: string;
  priority?: 'high' | 'medium' | 'low';
  is_holiday?: boolean;
  holiday_id?: string;
}

export enum AppStatus {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

export const APP_CONFIG = {
  defaultView: 'month',
  refreshInterval: 60000,
  maxEvents: 100,
  storageKey: 'family_calendar_storage',
  defaultCountry: 'ES'
};

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

export type NotificationType = 'email' | 'push' | 'sms';

export function isValidEvent(event: FamilyEvent): boolean {
  return !!event.title && !!event.start_date;
}

// Alias para compatibilidad con código existente
export type Event = FamilyEvent;
