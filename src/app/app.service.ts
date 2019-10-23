import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  protected static WEB_URL = 'http://localhost:8080/';

  constructor(protected http: HttpClient) {
  }

  getObject(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  sendObject(object, url: string): Observable<HttpResponse<any>> {
    console.log(object);
    if (object.id != null) {
      return this.http.put<HttpResponse<any>>(url + '/' + object.id, object, {observe: 'response'});
    }
    return this.http.post<HttpResponse<any>>(url, object, {observe: 'response'});
  }
}
