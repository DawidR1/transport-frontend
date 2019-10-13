import {Injectable} from '@angular/core';
import {AppService} from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class CarService extends AppService {

  public static CAR_URL = AppService.WEB_URL + 'car';
  private carUpdate: Car;

  addCar(car: Car) {
    this.carUpdate = car;
  }

  getAndRemoveCarForUpdate() {
    const carUpdate = this.carUpdate;
    this.carUpdate = null;
    return carUpdate;
  }

}

export interface ResourceCar {
  _embedded;
}

export class Car {
  constructor(public id?: string,
              public plate?: string,
              public brand?: string,
              public model?: string) {
  }
}

export class CustomResponse {
  constructor(public alertType?: string,
              public message?: string) {
  }
}
