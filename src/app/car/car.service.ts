import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http: HttpClient) {
  }

  getCar(): Observable<ResourceCar> {
    return this.http.get<ResourceCar>('http://localhost:8080/car');
  }

  sendCar(car: Car): Observable<Car> {
    return this.http.post<Car>('http://localhost:8080/car', car);
  }
}

export interface ResourceCar {
  _embedded;
}

export class Car {
  constructor(public plate?: string,
              public brand?: string,
              public model?: string) {
  }
}
