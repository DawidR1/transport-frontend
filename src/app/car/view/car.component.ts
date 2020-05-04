import {Component, OnInit} from '@angular/core';
import {Car, CarService} from '../car.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  carsView: Array<Car> = new Array<Car>();
  pageSize: number;
  totalItems: number;
  isLoadingResults: boolean;

  constructor(private service: CarService, private router: Router) {

  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.requestObjects();
    this.isLoadingResults = false;
  }

  private requestObjects(index: number = 0) {
    const cars = new Array<Car>();
    this.service.getObjectPage(CarService.CAR_URL, index).subscribe(resource => {
        resource._embedded.resources.forEach(car => {
          cars.push(car);
        });
        this.pageSize = resource.page.size;
        this.totalItems = resource.page.totalElements;
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );
    this.carsView = cars;
  }

  saveInService(car: Car) {
    this.service.addCar(car);
    this.router.navigate(['car-form-update']);
  }

  nextObjectsPage($event: PageEvent) {
    this.isLoadingResults = true;
    this.requestObjects($event.pageIndex);
    this.isLoadingResults = false;
  }
}

