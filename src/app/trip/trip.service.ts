import {AppService} from '../app.service';
import {Car} from '../car/car.service';
import {Driver} from '../driver/driver.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripService extends AppService {

  tripUpdate: TripDto;

  public addTripToUpdateForm(trip: TripDto) {
    this.tripUpdate = trip;
  }

  getAndRemoveTripForUpdate(): TripDto {
    const trip = this.tripUpdate;
    this.tripUpdate = null;
    return trip;
  }

  showInMaps(locations: Array<Location>): void {
    let url = TripService.MAPS_URL;
    const params = locations.map(location => {
      const street = location.streetAddress;
      const postalCode = location.postalCode;
      const city = location.city;
      return street + ',+' + postalCode + '+' + city;
    }).join('/');
    url += params;
    window.open(url);
  }
}


export class Location {
  constructor(public id?: number,
              public streetAddress?: string,
              public postalCode?: string,
              public city?: string,
              public country?: string) {
  }

  name() {
    return this.postalCode + ' ' + this.streetAddress + ' ' + this.city + ' ' + this.country;
  }
}

export class TripFormData {
  constructor(public id?: number,
              public status?: TripStatus,
              public destinations?: Array<Location>,
              public placeFinish?: Array<Location>,
              public car?: Array<Car>,
              public drivers?: Array<Driver>,
              public placeStart?: Array<Location>) {
  }
}

export class TripDto {
  constructor(public id?: number,
              public status?: TripStatus,
              public destination?: Location,
              public dateStart?: string,
              public dateFinish?: string,
              public placeFinish?: Location,
              public car?: Car,
              public driver?: Driver,
              public placeStart?: Location,
              public income?: number,
              public loadingPlaces?: Array<LoadingPlace>,
              public distance?: number,
              public fuel?: number,
              public cost?: number,
              public driverSalary?: number) {
  }
}

export enum TripStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  OPEN = 'OPEN'
}

export class LoadingPlace {
  constructor(public id?: number,
              public nr?: number,
              public date?: string,
              public location?: Location,
              public income?: number,
              public cargo?: Array<Cargo>,
              public finished?: boolean) {
  }
}

export class Cargo {
  constructor(public id?: number,
              public numberOfPallets?: number,
              public weight?: number,
              public companyName?: string) {
  }
}
