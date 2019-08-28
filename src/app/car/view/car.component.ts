import { Component, OnInit } from '@angular/core';
import {Car, CarService} from '../car.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  cars = [];

  constructor(private service: CarService, private router: Router) {
  }

  ngOnInit() {
    this.service.getCar().subscribe(resource => {
      resource._embedded.carDtoes.forEach(car => {
        this.cars.push(car);
      });
     },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );
  }

  saveInService(car: Car) {
    this.service.addCar(car);
    this.router.navigate(['car-form-update']);
  }
}

