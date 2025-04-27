import { environment } from '../../../environments/environment';
import { Logger } from './logger';

export class TokenManager {
  private static token: string = environment.apiKey;

  public static getToken(): string {
    return this.token;
  }

  public static refreshToken(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        Logger.info('Token refreshed');
        resolve(this.token);
      }, 300);
    });
  }

  public static saveToken(token: string): void {
    localStorage.setItem('api_token', token);
    Logger.info('Token saved');
    this.token = token;
  }

  public static isTokenValid(): boolean {
    return !!this.token;
  }

  public static getAuthHeaders(): any {
    return {
      'x-rapidapi-key': this.getToken(),
      'x-rapidapi-host': 'public-holidays7.p.rapidapi.com',
    };
  }
}
