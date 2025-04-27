export const APP_CONFIG = {
  defaultView: 'month',
  refreshInterval: 60000,
  maxEvents: 100,
  storageKey: 'family_calendar_storage',
  defaultCountry: 'ES',
};

export enum AppStatus {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export type NotificationType = 'email' | 'push' | 'sms';
