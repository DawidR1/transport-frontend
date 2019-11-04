import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Driver, DriverLicense, DriverService} from '../driver.service';
import {CustomResponse} from '../../car/car.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.css']
})
export class DriverFormComponent implements OnInit {

  driver = new Driver();
  form: FormGroup;
  fileForm = new FormData();
  response = new CustomResponse();
  driverLicenses: DriverLicense[] = [DriverLicense.A, DriverLicense.B, DriverLicense.C];
  private fileName: string;

  constructor(private service: DriverService) {
  }

  ngOnInit() {
    const driverUpdate = this.service.getAndRemoveCarForUpdate();
    driverUpdate != null ? this.populateFormCell(driverUpdate) : this.populateFormCell(new Driver());
    console.log(driverUpdate);
  }

  submit() {
    console.log(this.form);
    this.populateDriver();
    this.service.sendObject(this.driver, DriverService.DRIVER_URL).subscribe(response => {
        const id = this.retrieveIdFromResponse(response);
        if (!this.fileForm.has('file')) {
          this.sendSuccessToView();
          return;
        }
        this.service.sendFile(this.fileForm, id).subscribe(response2 => {
            this.sendSuccessToView();
          },
          (error: HttpErrorResponse) => {
            this.sendFailureToView(error);
          });
      },
      (error: HttpErrorResponse) => {
        this.sendFailureToView(error);
      }
    );
  }

  private sendSuccessToView() {
    this.response.alertType = 'alert-success';
    this.response.message = 'Done';
    this.form.reset();
  }

  private populateDriver() {
    this.driver.id = this.form.get('id').value;
    this.driver.pesel = this.form.get('pesel').value;
    this.driver.firstName = this.form.get('firstName').value;
    this.driver.lastName = this.form.get('lastName').value;
    this.driver.email = this.form.get('email').value;
    this.driver.drivingLicense = this.form.get('drivingLicense').value;
    this.driver.birth = this.form.get('birth').value;
  }

  private sendFailureToView(error: HttpErrorResponse) {
    this.response.alertType = 'alert-danger';
    this.response.message = error.error.message;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.fileForm.append('file', event.target.files[0]);
      this.fileName = event.target.files[0].name;
    }
  }

  private retrieveIdFromResponse(response: HttpResponse<any>): string {
    const split = response.headers.get('Location').split('/');
    return split[split.length - 1];
  }

  private populateFormCell(driver: Driver) {
    console.log(driver.imageName);
    this.form = new FormGroup({
      id: new FormControl(driver.id),
      pesel: new FormControl(driver.pesel, {
        validators: [Validators.required, Validators.pattern('[0-9]{12}')], updateOn: 'blur'
      }),
      firstName: new FormControl(driver.firstName, Validators.required),
      lastName: new FormControl(driver.lastName, Validators.required),
      email: new FormControl(driver.email, Validators.email),
      birth: new FormControl(driver.birth, Validators.required),
      drivingLicense: new FormControl(driver.drivingLicense, Validators.required)
    });
    this.fileName = driver.imageName;
  }
}
