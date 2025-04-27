import { ErrorHandler, Injectable } from '@angular/core';
import { Logger } from './logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    AppErrorHandler.handleError(error, 'GlobalErrorHandler');
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
    let message = 'An unexpected error occurred.';
    let status = 0;

    if (error.response) {
      status = error.response.status;

      if (status >= 400 && status < 500) {
        message = 'A client error occurred. Please check your request.';
      } else if (status >= 500 && status < 600) {
        message = 'A server error occurred. Please try again later.';
      }

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
        case 429:
          message = 'Too many requests. Please try again later.';
          break;
      }
    }

    Logger.error(`HTTP Error: ${message}`, error);
    return { message, status };
  }
}
