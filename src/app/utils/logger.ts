export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

let GLOBAL_LOG_LEVEL = LogLevel.INFO; // Nivel de log predeterminado
let LOG_TO_SERVER = false; // Controla si los logs se envían al servidor
let SERVER_ENDPOINT = 'https://log-service.example.com/logs'; // Endpoint del servidor

export class Logger {
  // Permite configurar dinámicamente el nivel de log
  static setLogLevel(level: LogLevel) {
    GLOBAL_LOG_LEVEL = level;
  }

  // Permite habilitar o deshabilitar el envío de logs al servidor
  static enableServerLogging(enable: boolean, endpoint?: string) {
    LOG_TO_SERVER = enable;
    if (endpoint) {
      SERVER_ENDPOINT = endpoint;
    }
  }

  // Formatea los mensajes de log con timestamp
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

  // Guarda logs en el almacenamiento local
  private static saveToLocalStorage(level: string, message: string) {
    try {
      const logs = JSON.parse(localStorage.getItem('logs') || '[]');
      logs.push({ level, message, timestamp: new Date().toISOString() });
      localStorage.setItem('logs', JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save log to localStorage', e);
    }
  }

  // Envía logs al servidor
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

export class AppErrorHandler {
  static handleError(error: any, componentName?: string) {
    const errorMsg = error.message || 'Unknown error occurred';
    Logger.error(
      `Error in ${componentName || 'unknown component'}: ${errorMsg}`,
      error
    );

    return {
      userMessage: 'Something went wrong. Please try again or contact support.',
      technical: errorMsg,
      timestamp: new Date().toISOString(),
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
