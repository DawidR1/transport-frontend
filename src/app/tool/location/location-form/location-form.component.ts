import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Car, CustomResponse} from '../../../car/car.service';
import {ToolService} from '../../tool.service';
import {Location, TripService} from '../../../trip/trip.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class LocationFormComponent implements OnInit {

  form: FormGroup;
  location: Location = new Location();
  response = new CustomResponse();

  constructor(private service: ToolService) {
  }

  ngOnInit() {
    const locationUpdate = this.service.getAndRemoveObjectForUpdate();
    locationUpdate != null ? this.populateFormCell(locationUpdate) : this.populateFormCell(new Location());
  }

  private populateFormCell(location: Location) {
    this.form = new FormGroup({
      id: new FormControl(location.id),
      streetAddress: new FormControl(location.streetAddress, Validators.required),
      postalCode: new FormControl(location.postalCode, Validators.required),
      city: new FormControl(location.city, Validators.required),
      country: new FormControl(location.country, Validators.required)
    });
  }

  submit() {
    this.location.id = this.form.get('id').value;
    this.location.streetAddress = this.form.get('streetAddress').value;
    this.location.postalCode = this.form.get('postalCode').value;
    this.location.city = this.form.get('city').value;
    this.location.country = this.form.get('country').value;
    this.service.sendObject(this.location, TripService.LOCATION_URL).subscribe(resource => {
        console.log(resource.headers.get('Location'));
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
