import {Pipe, PipeTransform} from '@angular/core';
import {Location} from './trip/trip.service';

@Pipe({
  name: 'toString'
})
export class ToStringPipe implements PipeTransform {

  transform(location: Location, args?: any): string {
    if (location != null) {
      return location.postalCode + ' ' + location.streetAddress + ' ' + location.city + ' ' + location.country;
    } else {
      return '';
    }
  }

}
