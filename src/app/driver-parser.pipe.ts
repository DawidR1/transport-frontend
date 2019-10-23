import { Pipe, PipeTransform } from '@angular/core';
import {Driver} from './driver/driver.service';

@Pipe({
  name: 'driverParser'
})
export class DriverParserPipe implements PipeTransform {

  transform(value: any, args?: any): Driver {
    return value as Driver;
  }

}
