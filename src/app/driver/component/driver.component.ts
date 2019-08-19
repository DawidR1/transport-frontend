import {Component, OnInit} from '@angular/core';
import {DriverService, ResourceDriver} from '../driver.service';
import {HttpErrorResponse} from '@angular/common/http';

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
        this.populateFields(resourceDriver);
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );
  }

  populateFields(resourceDriver: ResourceDriver): void {
    resourceDriver._embedded.driverDtoes.forEach(driver => {

      driver._links.image != null ? driver.imageUrl = driver._links.image.href : driver.imageUrl = '';

      this.drivers.push(driver);
    });
  }
}


