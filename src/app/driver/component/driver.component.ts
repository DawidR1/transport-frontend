import { Component, OnInit } from '@angular/core';
import { DriverService } from '../driver.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],

})
export class DriverComponent implements OnInit {

  drivers = [];

  constructor(private driverService: DriverService) {
  }

  ngOnInit() {
    this.driverService.getDriver().subscribe(resourceDriver => {
      console.log(resourceDriver._embedded.driverDtoes);
      resourceDriver._embedded.driverDtoes.forEach(driver => {
        this.drivers.push(driver);
      });
     },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );

  }
}
export interface Driver {

  pesel?: string;
  lastName?: string;
  firstName?: string;


}
