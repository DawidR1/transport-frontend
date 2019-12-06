import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from './AuthenticationService';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('hwtIntercept: intercept');
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      console.log('current user' + currentUser);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      // request = request.clone({
      //   headers: request.headers.set('Access-Control-Allow-Origin', '*')
      // });
    }
    return next.handle(request);
  }
}
