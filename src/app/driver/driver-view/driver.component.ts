import {Component, OnInit} from '@angular/core';
import {Driver, DriverService} from '../driver.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],

})
export class DriverComponent implements OnInit {

  driversView = [];
  pageSize: number;
  totalItems: number;

  constructor(private service: DriverService, private router: Router) {
  }

  ngOnInit() {
    this.requestDriver();
  }

  private requestDriver(index: number = 0, size: number = 4) {
    this.service.getObjectPage(DriverService.DRIVER_URL, index, size).subscribe(resourceDriver => {
        this.populateFields(resourceDriver);
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );
  }

  populateFields(resource: any): void {
    const data = new Array<Driver>();
    resource._embedded.entityModels.forEach(driver => {
      driver._links.image != null ? driver.imageUrl = driver._links.image.href : driver.imageUrl = '';
      data.push(driver);
    });
    this.pageSize = resource.page.size;
    this.totalItems = resource.page.totalElements;
    this.driversView = data;
  }

  openUpdateForm(driver: Driver) {
    this.service.addDriverToUpdateForm(driver);
    this.router.navigate(['driver-form-update']);
  }

  naextObjectsPage($event: PageEvent) {
    this.requestDriver($event.pageIndex);
  }

  openDetailsView(driver: Driver) {
    this.service.addDriverToDetailsView(driver);
    this.router.navigate(['driver-details-view']);
  }
}


