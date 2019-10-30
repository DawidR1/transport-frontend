import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AppService} from '../app.service';
import {Car} from '../car/car.service';

@Injectable()
export class DriverService extends AppService {

  public static DRIVER_URL = AppService.WEB_URL + 'driver/';
  public static DRIVER_NARROW_URL = DriverService.DRIVER_URL + '/narrow';
  private driverUpdate: Driver;

  sendFile(form: FormData, id: string): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>('http://localhost:8080/file/driver/' + id, form, {observe: 'response'});
  }

  addDriverToUpdateForm(driver: Driver) {
    this.driverUpdate = driver;
  }

  getAndRemoveCarForUpdate() {
    const driverUpdate = this.driverUpdate;
    this.driverUpdate = null;
    return driverUpdate;
  }
}

export class Driver {
  id?: string;
  pesel?: string;
  lastName?: string;
  firstName?: string;
  imageName?: string;
  file: any;
}


