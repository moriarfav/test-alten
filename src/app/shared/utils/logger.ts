export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

let GLOBAL_LOG_LEVEL = LogLevel.INFO;
let LOG_TO_SERVER = false;
let SERVER_ENDPOINT = 'https://log-service.example.com/logs';

export class Logger {
  static setLogLevel(level: LogLevel) {
    GLOBAL_LOG_LEVEL = level;
  }

  static enableServerLogging(enable: boolean, endpoint?: string) {
    LOG_TO_SERVER = enable;
    if (endpoint) {
      SERVER_ENDPOINT = endpoint;
    }
  }
  // se añade timestamp para mejor control de errores
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static debug(message: string, ...data: any[]) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.DEBUG) {
      const formattedMessage = this.formatMessage('DEBUG', message);
      console.debug(formattedMessage, ...data);
      this.saveToLocalStorage('debug', formattedMessage);
    }
  }

  static info(message: string, ...data: any[]) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.INFO) {
      const formattedMessage = this.formatMessage('INFO', message);
      console.info(formattedMessage, ...data);
    }
  }

  static warn(message: string, ...data: any[]) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.WARN) {
      const formattedMessage = this.formatMessage('WARN', message);
      console.warn(formattedMessage, ...data);
    }
  }

  static error(message: string, error?: any) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.ERROR) {
      const formattedMessage = this.formatMessage('ERROR', message);
      console.error(formattedMessage, error);

      if (LOG_TO_SERVER) {
        this.sendToServer('error', formattedMessage, error);
      }
    }
  }

  static critical(message: string, error?: any) {
    if (GLOBAL_LOG_LEVEL <= LogLevel.CRITICAL) {
      const formattedMessage = this.formatMessage('CRITICAL', message);
      console.error(formattedMessage, error);

      if (LOG_TO_SERVER) {
        this.sendToServer('critical', formattedMessage, error);
      }
    }
  }

  private static saveToLocalStorage(level: string, message: string) {
    try {
      const logs = JSON.parse(localStorage.getItem('logs') || '[]');
      logs.push({ level, message, timestamp: new Date().toISOString() });
      localStorage.setItem('logs', JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save log to localStorage', e);
    }
  }

  private static async sendToServer(
    level: string,
    message: string,
    error?: any
  ) {
    try {
      const payload = {
        level,
        message,
        error: error ? JSON.stringify(error) : undefined,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(SERVER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('Failed to send log to server', response.statusText);
      }
    } catch (e) {
      console.error('Error sending log to server', e);
    }
  }
}
