import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from './AuthenticationService';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private router: Router,) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('errorFilter: intercept');
    console.log(next);
    return next.handle(request).pipe(catchError(err => {
      console.log(err);
      if (err.status === 401 || err.status === 403) {
        console.log('errorFilter: intercept 401');
        this.authenticationService.logout();
        // this.router.navigate(['/login']);
        location.reload(true);
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
