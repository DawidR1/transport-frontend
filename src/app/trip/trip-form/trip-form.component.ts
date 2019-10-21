import {Component, OnInit} from '@angular/core';
import {Cargo, LoadingPlace, LoadingPlaceForm, Location, TripDto, TripForm, TripService, TripStatus, TripView} from '../trip.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DriverService} from '../../driver/driver.service';
import {CarService} from '../../car/car.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css']
})
export class TripFormComponent implements OnInit {

  tripForm: TripForm = new TripForm();
  tripDto: TripDto = new TripDto();
  tripStatus: TripStatus[] = [TripStatus.OPEN, TripStatus.FINISHED, TripStatus.IN_PROGRESS];
  form: FormGroup;

  constructor(private service: TripService, private fd: FormBuilder) {
  }

  ngOnInit() {
    this.service.getObject(TripService.LOCATION_URL)
      .subscribe(resource => {
          this.populateLocation(resource._embedded.locationDtoes);
        }, (error: HttpErrorResponse) => {
          console.log(error.status);
          return;
        }
      );
    this.service.getObject(DriverService.DRIVER_NARROW_URL)
      .subscribe(driverNarrow => {
          this.tripForm.employee = this.getMap(driverNarrow);
        }, (error: HttpErrorResponse) => {
          console.log(error.status);
          return;
        }
      );
    this.service.getObject(CarService.CAR_NARROW_URL)
      .subscribe(carNarrow => {
          this.tripForm.car = this.getMap(carNarrow);
        }, (error: HttpErrorResponse) => {
          console.log(error.status);
          return;
        }
      );
    const tripUpdate = this.service.getAndRemoveTripForUpdate();
    tripUpdate != null ? this.populateFormCell(tripUpdate) : this.populateFormCell(new TripView());
  }

  private getMap(driverNarrow: any): Map<number, string> {
    const idByName = new Map<number, string>();
    for (let t in driverNarrow) {
      idByName.set(Number(t), driverNarrow[t]);
    }
    return idByName;
  }

  private populateLocation(locations: Array<Location>) {
    let idByName: Map<number, string> = new Map<number, string>();
    locations.forEach(value => {
      idByName.set(value.id, value.postalCode + ' ' + value.streetAddress + ' ' + value.city + ' ' + value.country);
    });
    this.tripForm.destination = idByName;
    this.tripForm.placeFinish = idByName;
    this.tripForm.placeStart = idByName;
  }

  submit() {
    this.populateTrip();
    this.service.sendObject(this.tripDto, TripService.TRIP_URL).subscribe(response => {
        console.log(response);
      }, (error: HttpErrorResponse) => {
        console.log(error.status);
        return;
      }
    );
  }

  private populateTrip() {
    this.tripDto.status = this.form.get('status').value;
    this.tripDto.carId = this.form.get('carId').value;
    this.tripDto.employeeId = this.form.get('driverId').value;
    this.tripDto.cost = this.form.get('cost').value;
    this.tripDto.destinationId = this.form.get('destinationId').value;
    this.tripDto.dateFinish = this.form.get('dateFinish').value;
    this.tripDto.distance = this.form.get('distance').value;
    this.tripDto.dateStart = this.form.get('dateStart').value;
    this.tripDto.driverSalary = this.form.get('driverSalary').value;
    this.tripDto.income = this.form.get('income').value;
    this.tripDto.fuel = this.form.get('fuel').value;
    this.tripDto.placeFinishId = this.form.get('placeFinishId').value;
    this.tripDto.placeStartId = this.form.get('placeStartId').value;

    const loadingPlaceControls = this.form.get('loadingPlaces').value;
    this.tripDto.loadingPlaces = new Array<LoadingPlaceForm>();

    loadingPlaceControls.forEach(loadingPlaceControl => {
      const loadingPlace = new LoadingPlaceForm();
      loadingPlace.nr = loadingPlaceControl.nr;
      loadingPlace.date = loadingPlaceControl.date;
      loadingPlace.locationId = loadingPlaceControl.locationId;
      loadingPlace.income = loadingPlaceControl.income;
      loadingPlace.cargo = new Array<Cargo>();
      loadingPlaceControl.cargos.forEach(cargoControl => {
        const cargo = new Cargo();
        cargo.companyName = cargoControl.companyName;
        cargo.numberOfPallets = cargoControl.numberOfPallets;
        cargo.weight = cargoControl.weight;
        loadingPlace.cargo.push(cargo);
      });
      this.tripDto.loadingPlaces.push(loadingPlace);
    });
    console.log(this.tripDto);
  }

  private populateFormCell(trip: TripView) {
    const formLoadingPlaceGroups = trip.loadingPlaces == null ? [] : this.populateLoadingPlaces(trip.loadingPlaces);
    this.form = this.fd.group({
      id: trip.id,
      status: trip.status,
      dateStart: trip.dateStart,
      dateFinish: trip.dateFinish,
      income: trip.income,
      cost: trip.cost,
      fuel: trip.fuel,
      driverSalary: trip.driverSalary,
      distance: trip.distance,
      destinationId: trip.destination == null ? '' : trip.destination.id,
      placeFinishId: trip.placeFinish == null ? '' : trip.placeFinish.id,
      placeStartId: trip.placeStart == null ? '' : trip.placeStart.id,
      driverId: trip.employee == null ? '' : trip.employee.id,
      carId: trip.car == null ? '' : trip.car.id,
      loadingPlaces: this.fd.array(formLoadingPlaceGroups)
    });
    console.log('sdad');
    console.log(trip);
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
      locationId: loadingPlace.location == null ? '' : loadingPlace.location.id,
      income: loadingPlace.income,
      cargos: this.fd.array(cargosGroup)
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
    const cos = mainForm[nr].get('cargos');
    console.log(cos)
    cos.push(this.getCargos(new Cargo()));
  }

}
