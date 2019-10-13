import {Injectable} from '@angular/core';
import {AppService} from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class TripService extends AppService {

  public static TRIP_URL = AppService.WEB_URL + 'trip/';

}
