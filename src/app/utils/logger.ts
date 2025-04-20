export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

const GLOBAL_LOG_LEVEL = LogLevel.INFO;
const LOG_TO_SERVER = false;
const SERVER_ENDPOINT = 'https://log-service.example.com/logs';

export class Logger {
  static debug(message: string, ...data: any[]) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...data);
      this.saveToLocalStorage('debug', message);
    }
  }
  
  static info(message: string, ...data: any[]) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...data);
    }
  }
  
  static warn(message: string, ...data: any[]) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...data);
    }
  }
  
  static error(message: string, error?: any) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error);
      
      if (LOG_TO_SERVER) {
        this.sendToServer('error', message, error);
      }
    }
  }
  
  static critical(message: string, error?: any) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.CRITICAL) {
      console.error(`[CRITICAL] ${message}`, error);
      alert(`Critical error: ${message}`);
      
      if (LOG_TO_SERVER) {
        this.sendToServer('critical', message, error);
      }
    }
  }
  
  private static saveToLocalStorage(level: string, message: string) {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push({
        level,
        message,
        timestamp: new Date().toISOString()
      });
      if (logs.length > 100) {
        logs.shift();
      }
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving log to localStorage', e);
    }
  }
  
  private static sendToServer(level: string, message: string, data?: any) {
    try {
      fetch(SERVER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          message,
          data,
          app: 'family-calendar',
          timestamp: new Date().toISOString()
        })
      }).catch(e => console.error('Error sending log to server', e));
    } catch (e) {
      console.error('Error preparing log for server', e);
    }
  }
}

export class AppErrorHandler {
  static handleError(error: any, componentName?: string) {
    const errorMsg = error.message || 'Unknown error occurred';
    Logger.error(`Error in ${componentName || 'unknown component'}: ${errorMsg}`, error);
    
    return {
      userMessage: 'Something went wrong. Please try again or contact support.',
      technical: errorMsg,
      timestamp: new Date().toISOString()
    };
  }
  
  static handleHttpError(error: any) {
    let message = 'Network error occurred';
    let status = 0;
    
    if (error.response) {
      status = error.response.status;
      switch (status) {
        case 401:
          message = 'Authentication failed. Please login again.';
          window.location.href = '/login';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 500:
          message = 'Server error occurred. Please try again later.';
          break;
        default:
          message = `Server returned error code ${status}`;
      }
    }
    
    Logger.error(`HTTP Error: ${message}`, error);
    return { message, status };
  }
}
