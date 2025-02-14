import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from './AuthenticationService';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
        if (!request.url.match('auth') && (err.status === 401)) {
          this.authenticationService.logout();
          location.reload(true);
        } else if (!request.url.match('auth') && err.status === 403) {
          return throwError('You do not have a permission to perform this operation');
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      }
    ));
  }
}
