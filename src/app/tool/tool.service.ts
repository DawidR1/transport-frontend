import {Injectable} from '@angular/core';
import {AppService} from '../app.service';
import {Location} from '../trip/trip.service';

@Injectable({
  providedIn: 'root'
})
export class ToolService extends AppService {

  locationToUpdate: Location;

  addLocation(location: Location) {
    this.locationToUpdate = location;
  }

  getAndRemoveObjectForUpdate(): Location {
    const location = this.locationToUpdate;
    this.locationToUpdate = null;
    return location;
  }
}

