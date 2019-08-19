import {Component, OnInit} from '@angular/core';
import {Car, CarService} from '../car.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit {

  car = new Car();
  form: FormGroup;

  constructor(private service: CarService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      plate: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('[A-Z]{2,3}[0-9]{4,5}')], updateOn: 'blur'
      }),
      brand: new FormControl(null, Validators.required),
      model: new FormControl(null, Validators.required)
    });
  }

  submit() {
    this.car.plate = this.form.get('plate').value;
    this.car.brand = this.form.get('brand').value;
    this.car.model = this.form.get('model').value;
    this.service.sendCar(this.car).subscribe(resource => {
      console.log(resource);
    });
  }
}

