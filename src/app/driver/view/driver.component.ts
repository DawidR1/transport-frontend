import {Component, OnInit} from '@angular/core';
import {Driver, DriverService, ResourceDriver} from '../driver.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],

})
export class DriverComponent implements OnInit {

  drivers = [];

  constructor(private service: DriverService, private router: Router) {
  }

  ngOnInit() {
    this.service.getDriver().subscribe(resourceDriver => {
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

  saveInService(driver: Driver) {
    this.service.driverUpdate = driver;
    this.router.navigate(['driver-form-update']);
  }
}


