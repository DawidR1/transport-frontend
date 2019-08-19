import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DriverService {

  constructor(private http: HttpClient) {
  }

  getDriver(): Observable<ResourceDriver> {
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
  imageUrl?: string;
}


