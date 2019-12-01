import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  protected static WEB_URL = 'http://localhost:8080/';
  public static RESOURCE_URL = 'resource/';

  public static TRIP_URL = AppService.WEB_URL + 'trip/';
  public static RESOURCE_TRIP_URL = AppService.WEB_URL + AppService.RESOURCE_URL + 'trip/';

  public static LOCATION_URL = AppService.WEB_URL + 'location/';
  public static RESOURCE_LOCATION_URL = AppService.WEB_URL + AppService.RESOURCE_URL + 'location/';

  public static DRIVER_URL = AppService.WEB_URL + 'driver/';
  public static RESOURCE_DRIVER_URL = AppService.WEB_URL + AppService.RESOURCE_URL + 'driver/';

  public static CAR_URL = AppService.WEB_URL + 'car';
  public static RESOURCE_CAR_URL = AppService.WEB_URL + AppService.RESOURCE_URL + 'car';

  static MAPS_URL = 'https://www.google.com/maps/dir/';
  public static  USER_AUTH_URL = AppService.WEB_URL + 'auth' ;

  constructor(protected http: HttpClient) {
  }

  getObject(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getObjectPage(url: string, index: number, size: number = 5): Observable<any> {
    return this.http.get<any>(url + '?page=' + index + '&size=' + size);
  }

  getObjectPageFilter(url: string, index: number, size: number = 5, from: string, to: string): Observable<any> {
    return this.http.get<any>(url + '?page=' + index + '&size=' + size + '&fromDate=' + from + '&toDate=' + to);
  }

  sendObject(object, url: string): Observable<HttpResponse<any>> {
    console.log(object);
    if (object.id != null) {
      return this.http.put<HttpResponse<any>>(url + '/' + object.id, object, {observe: 'response'});
    }
    return this.http.post<HttpResponse<any>>(url, object, {observe: 'response'});
  }
}
