import {Injectable} from '@angular/core';
import {AppService} from '../app.service';
import {Car} from '../car/car.service';
import {Driver} from '../driver/driver.service';

@Injectable({
  providedIn: 'root'
})
export class TripService extends AppService {

  public static TRIP_URL = AppService.WEB_URL + 'trip/';
  static LOCATION_URL = AppService.WEB_URL + 'location/';
  tripUpdate: TripView;

  public addTripToUpdateForm(trip: TripView) {
    this.tripUpdate = trip;
  }

  getAndRemoveTripForUpdate(): TripView {
      const trip = this.tripUpdate;
      this.tripUpdate = null;
      return trip;
  }
}


export class Location {
  constructor(public id: number,
              public streetAddress: string,
              public postalCode: string,
              public city: string,
              public country: string) {
  }

  name() {
    return this.postalCode + ' ' + this.streetAddress + ' ' + this.city + ' ' + this.country;
  }
}

export class TripDto {
  constructor(public id?: number,
              public status?: TripStatus,
              public destinationId?: number,
              public dateStart?: string,
              public dateFinish?: string,
              public placeFinishId?: number,
              public carId?: number,
              public employeeId?: number,
              public placeStartId?: number,
              public income?: number,
              public loadingPlaces?: Array<LoadingPlaceForm>,
              public distance?: number,
              public fuel?: number,
              public cost?: number,
              public driverSalary?: number) {
  }
}

export class TripForm {
  constructor(public id?: number,
              public status?: TripStatus,
              public destination?: Map<number, string>,
              public dateStart?: string,
              public dateFinish?: string,
              public placeFinish?: Map<number, string>,
              public car?: Map<number, string>,
              public employee?: Map<number, string>,
              public placeStart?: Map<number, string>,
              public income?: number,
              public loadingPlaces?: Map<number, string>,
              public distance?: number,
              public fuel?: number,
              public cost?: number,
              public driverSalary?: number) {
  }
}

export class TripView {
  constructor(public id?: number,
              public status?: TripStatus,
              public destination?: Location,
              public dateStart?: string,
              public dateFinish?: string,
              public placeFinish?: Location,
              public car?: Car,
              public employee?: Driver,
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

// export class LoadingPlaceForm {
//   constructor(public id?: number,
//               public nr?: number,
//               public date?: string,
//               public locationId?: number,
//               public income?: number,
//               public cargo?: Array<Cargo>) {
//   }
// }

export class LoadingPlaceForm {
  constructor(public id?: number,
              public nr?: number,
              public date?: string,
              public locationId?: number,
              public income?: number,
              public cargo?: Array<Cargo>) {
  }
}

export class LoadingPlace {
  constructor(public id?: number,
              public nr?: number,
              public date?: string,
              public location?: Location,
              public income?: number,
              public cargo?: Array<Cargo>) {
  }
}

export class Cargo {
  constructor(public id?: number,
              public numberOfPallets?: number,
              public weight?: number,
              public companyName?: string) {
  }
}
