import {Component, OnInit} from '@angular/core';
import {Car, CarService} from '../car.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  carsView = [];
  cars = [];
  private _filter: string;

  public get filter(): string {
    return this._filter;
  }

  public set filter(value: string) {
    this._filter = value.toLowerCase();
    this.filterChangingSet();
  }

  constructor(private service: CarService, private router: Router) {
  }

  ngOnInit() {
    this.service.getObject(CarService.CAR_URL).subscribe(resource => {
        resource._embedded.carDtoes.forEach(car => {
          this.cars.push(car);
        });
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );
    this.carsView = this.cars;
  }

  saveInService(car: Car) {
    this.service.addCar(car);
    this.router.navigate(['car-form-update']);
  }

  private filterChangingSet() {
    if (this.filter === '') {
      this.carsView = this.cars;
    } else {
      this.carsView = this.cars.filter(car => car.plate.toLowerCase().includes(this.filter)
        || car.model.toLowerCase().includes(this.filter)
        || car.brand.toLowerCase().includes(this.filter));
    }
  }
}

