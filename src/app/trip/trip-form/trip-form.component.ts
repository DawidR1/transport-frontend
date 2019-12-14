import {Component, OnInit} from '@angular/core';
import {Cargo, LoadingPlace, Location, TripDto, TripFormData, TripService, TripStatus} from '../trip.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DriverService} from '../../driver/driver.service';
import {CarService, CustomResponse} from '../../car/car.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css']
})
export class TripFormComponent implements OnInit {

  tripFormData: TripFormData = new TripFormData();
  tripDto: TripDto = new TripDto();
  tripStatus: TripStatus[] = [TripStatus.OPEN, TripStatus.FINISHED, TripStatus.IN_PROGRESS];
  form: FormGroup;
  response = new CustomResponse();
  done = false;

  constructor(private service: TripService, private fd: FormBuilder) {
  }

  ngOnInit() {
    this.service.getObject(TripService.RESOURCE_LOCATION_URL)
      .subscribe(resource => {
          this.populateLocation(resource._embedded.locationDtoes);
        }, (error: HttpErrorResponse) => {
          this.sendFailureToView(error);
          return;
        }
      );
    this.service.getObject(DriverService.RESOURCE_DRIVER_URL)
      .subscribe(resource => {
          this.tripFormData.drivers = resource._embedded.driverDtoes;
        }, (error: HttpErrorResponse) => {
          this.sendFailureToView(error);
          return;
        }
      );
    this.service.getObject(CarService.RESOURCE_CAR_URL)
      .subscribe(resource => {
          this.tripFormData.car = resource._embedded.carDtoes;
        }, (error: HttpErrorResponse) => {
          this.sendFailureToView(error);
          return;
        }
      );
    const tripUpdate = this.service.getAndRemoveTripForUpdate();
    tripUpdate != null ? this.populateFormCell(tripUpdate) : this.populateFormCell(new TripDto());
  }

  private populateLocation(locations: Array<Location>) {
    this.tripFormData.destinations = locations;
    this.tripFormData.placeFinish = locations;
    this.tripFormData.placeStart = locations;
  }



  private populateFormCell(trip: TripDto) {
    const formLoadingPlaceGroups = trip.loadingPlaces == null ? [] : this.populateLoadingPlaces(trip.loadingPlaces);
    this.form = this.fd.group({
      id: trip.id,
      status: [trip.status, Validators.required],
      dateStart: [trip.dateStart, Validators.required],
      dateFinish: trip.dateFinish,
      income: trip.income,
      cost: trip.cost,
      fuel: trip.fuel,
      driverSalary: trip.driverSalary,
      distance: trip.distance,
      destination: [trip.destination, Validators.required],
      placeFinish: trip.placeFinish,
      placeStart: [trip.placeStart, Validators.required],
      driver: [trip.driver, Validators.required],
      car: [trip.car, Validators.required],
      loadingPlaces: this.fd.array(formLoadingPlaceGroups)
    });
  }

  private populateLoadingPlaces(loadingPlaces: Array<LoadingPlace>) {
    return loadingPlaces.map(loadingPlace => this.getLoadingPlaces(loadingPlace));
  }

  private addLoadingPlace() {
    const mainForm = this.form.get('loadingPlaces') as FormArray;
    mainForm.push(this.getLoadingPlaces(new LoadingPlace()));
  }

  private getLoadingPlaces(loadingPlace: LoadingPlace): FormGroup {
    const cargosGroup = loadingPlace.cargo == null ? [] : this.populateCargos(loadingPlace.cargo);
    return this.fd.group({
      id: loadingPlace.id,
      nr: loadingPlace.nr,
      date: loadingPlace.date,
      location: loadingPlace.location,
      income: loadingPlace.income,
      cargo: this.fd.array(cargosGroup)
    });
  }

  private populateCargos(cargo: Array<Cargo>) {
    return cargo.map(carg => this.getCargos(carg));
  }

  private getCargos(cargo: Cargo) {
    return this.fd.group({
      id: cargo.id,
      numberOfPallets: cargo.numberOfPallets,
      weight: cargo.weight,
      companyName: cargo.companyName,
    });
  }

  addCargo(nr: number) {
    const mainForm = this.form.get('loadingPlaces')['controls'] as FormArray;
    console.log(nr);
    const cos = mainForm[nr].get('cargo');
    console.log(cos);
    cos.push(this.getCargos(new Cargo()));
  }

  compareById(o1, o2) {
    if (o1 == null || o2 == null) {
      return false;
    }
    return o1.id === o2.id;
  }

  private sendFailureToView(error: any) {
    console.log(error);
    this.response.alertType = 'alert-danger';
    this.response.message = error;
  }

  submit() {
    this.tripDto = this.form.value;
    this.service.sendObject(this.tripDto, TripService.TRIP_URL).subscribe(response => {
        console.log(response);
        this.done = true;
      }, (error: HttpErrorResponse) => {
        this.sendFailureToView(error);
      }
    );
  }
}
