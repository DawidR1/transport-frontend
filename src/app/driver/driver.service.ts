import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AppService} from '../app.service';
import {Car} from '../car/car.service';

@Injectable()
export class DriverService extends AppService {

  private driverUpdate: Driver;
  private driverDetails: Driver;

  sendFile(form: FormData, id: string): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>('http://localhost:8080/file/driver/' + id, form, {observe: 'response'});
  }

  addDriverToUpdateForm(driver: Driver) {
    this.driverUpdate = driver;
  }

  addDriverToDetailsView(driver: Driver) {
    this.driverDetails = driver;
  }

  getAndRemoveCarForUpdate() {
    const driverUpdate = this.driverUpdate;
    this.driverUpdate = null;
    return driverUpdate;
  }

  getAndRemoveCarDetails(): Driver {
    const driver = this.driverDetails;
    this.driverDetails = null;
    return driver;
  }
}

export class Driver {
  id?: string;
  pesel?: string;
  lastName?: string;
  firstName?: string;
  imageName?: string;
  file?: any;
  email?: string;
  birth?: string;
  drivingLicense?: string;
  imageUrl?: string;
  phone?: string;
}

export enum DriverLicense {
  A = 'A',
  B = 'B',
  C = 'C'
}


