import { Component, OnInit } from '@angular/core';
import { CarService } from '../car.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  cars = [];

  constructor(private service: CarService) {
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
}

