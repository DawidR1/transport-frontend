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
  driversView = [];
  _filter: string;

  constructor(private service: DriverService, private router: Router) {
  }

  ngOnInit() {
    this.service.getObject(DriverService.DRIVER_URL).subscribe(resourceDriver => {
        this.populateFields(resourceDriver);
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );
    this.driversView = this.drivers;
  }

  populateFields(resourceDriver: ResourceDriver): void {
    resourceDriver._embedded.driverDtoes.forEach(driver => {
      driver._links.image != null ? driver.imageUrl = driver._links.image.href : driver.imageUrl = '';
      this.drivers.push(driver);
    });
  }

  saveInService(driver: Driver) {
    this.service.addDriverToUpdateForm(driver);
    this.router.navigate(['driver-form-update']);
  }

  public get filter(): string {
    return this._filter;
  }

  public set filter(value: string) {
    this._filter = value.toLowerCase();
    this.filterChangingSet();
  }

  private filterChangingSet() {
    if (this.filter === '') {
      this.driversView = this.drivers;
    } else {
      this.driversView = this.drivers.filter(driver => driver.pesel.toLowerCase().includes(this.filter)
        || driver.firstName.toLowerCase().includes(this.filter)
        || driver.lastName.toLowerCase().includes(this.filter));
    }
  }

}


