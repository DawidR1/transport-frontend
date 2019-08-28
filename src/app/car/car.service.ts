import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private carUpdate: Car;

  constructor(private http: HttpClient) {
  }

  getCar(): Observable<ResourceCar> {
    return this.http.get<ResourceCar>('http://localhost:8080/car');
  }

  sendCar(car: Car): Observable<HttpResponse<any>> {
    if (car.id != null) {
      return this.http.put<HttpResponse<any>>('http://localhost:8080/car/' + car.id, car, {observe: 'response'});
    }
    return this.http.post<HttpResponse<any>>('http://localhost:8080/car', car, {observe: 'response'});
  }

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
