import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DriverService {
  // drivers = [new Driver('dawid', 'co2', '12312')];
  // driversList = new BehaviorSubject<Array<Driver>>();
  constructor(private http: HttpClient) {

  }
  // resourceDriver = new ResourceDriver();

  getDriver(): Observable<ResourceDriver> {
    // resourceDriver = new ResourceDriver();
    return this.http.get<ResourceDriver>('http://localhost:8080/driver');
    }

}

export interface ResourceDriver {
  _embedded;
}

export interface Driver {

  pesel?: string;
  lastName?: string;
  firstName?: string;


}
