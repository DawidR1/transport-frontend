import {Component, OnInit} from '@angular/core';
import {Car, CarService, CustomResponse} from '../car.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit {

  car = new Car();
  form: FormGroup;
  response = new CustomResponse();

  constructor(private service: CarService) {
  }

  ngOnInit() {
    const carUpdate = this.service.getAndRemoveCarForUpdate();
    carUpdate != null ? this.populateFormCell(carUpdate) : this.populateFormCell(new Car());
  }

  private populateFormCell(carUpdate: Car) {
    console.log(carUpdate.id);
    this.form = new FormGroup({
      id: new FormControl(carUpdate.id),
      plate: new FormControl(carUpdate.plate, {
        validators: [Validators.required, Validators.pattern('[A-Z]{2,3}[0-9]{4,5}')], updateOn: 'blur'
      }),
      brand: new FormControl(carUpdate.brand, Validators.required),
      model: new FormControl(carUpdate.model, Validators.required)
    });
  }

  submit() {
    this.car.id = this.form.get('id').value;
    this.car.plate = this.form.get('plate').value;
    this.car.brand = this.form.get('brand').value;
    this.car.model = this.form.get('model').value;
    console.log(this.car);
    this.service.sendCar(this.car).subscribe(resource => {
        this.response.alertType = 'alert-success';
        this.response.message = 'Done';
        this.form.reset();
      },
      (error: HttpErrorResponse) => {
        this.response.alertType = 'alert-danger';
        this.response.message = error.error.message;
      });
  }
}

