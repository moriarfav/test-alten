import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiKey = environment.apiKey;
    const clonedReq = req.clone({
      setHeaders: {
        'X-RapidAPI-Key': apiKey,
      },
    });

    return next.handle(clonedReq).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error);
        throw error;
      })
    );
  }
}
