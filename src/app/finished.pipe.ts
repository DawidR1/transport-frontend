import {Pipe, PipeTransform} from '@angular/core';
import {Location} from './trip/trip.service';

@Pipe({
  name: 'finished'
})
export class FinishedPipe implements PipeTransform {

  transform(finished: boolean, args?: any): string {
    if (finished === true) {
      return 'YES';
    } else {
      return 'NO';
    }
  }

}
