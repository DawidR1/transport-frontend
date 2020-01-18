///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>
import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {Cargo, LoadingPlace, Location, TripDto, TripFormData, TripService, TripStatus} from '../trip.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DriverService} from '../../driver/driver.service';
import {CarService, CustomResponse} from '../../car/car.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MapsAPILoader, AgmGeocoder} from '@agm/core';
// import {GoogleMap} from '@agm/core/services/google-maps-types';
// import {google} from '@agm/core/services/google-maps-types';


// D:\angualr\transport\transport\node_modules
// D:\angualr\transport\transport\src\app\trip\trip-form\trip-form.component.ts
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
  lat ;
  lng ;
  origin;
  destination;
  viewPoints = [];
  locationResult = [];
  isMainInformationCollapse = true;
  isAdditionalInformationCollapse = true;
  isLoadPlaceInformationCollapse = true;


  constructor(private service: TripService, private fd: FormBuilder,
              private geocoder: AgmGeocoder) {
  }

  private setCurrentLocation(){

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }else {
      this.lat = 51.950155;
      this.lng =  18.709522
    }
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
    this.setCurrentLocation();
    this.draw();

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
      destination: [trip.destination, Validators.required],
      dateStart: [trip.dateStart, Validators.required],
      dateFinish: trip.dateFinish,
      placeStart: [trip.placeStart, Validators.required],
      placeFinish: trip.placeFinish,
      driver: [trip.driver, Validators.required],
      car: [trip.car, Validators.required],
      income: trip.income,
      cost: trip.cost,
      fuel: trip.fuel,
      driverSalary: trip.driverSalary,
      distance: trip.distance,
      loadingPlaces: this.fd.array(formLoadingPlaceGroups)
    });
  }

  private populateLoadingPlaces(loadingPlaces: Array<LoadingPlace>) {
    return loadingPlaces.map(loadingPlace => this.getLoadingPlaces(loadingPlace));
  }

  private addLoadingPlace() {
    const loadingPlaces = this.form.get('loadingPlaces') as FormArray;
    loadingPlaces.push(this.getLoadingPlaces(new LoadingPlace()));
    console.log(this.form.get('loadingPlaces')['controls'][0]['controls']['nr'].invalid)
  }

  removeLoadingPlace(i: number) {
    const loadingPlaces = this.form.get('loadingPlaces') as FormArray;
    loadingPlaces.removeAt(i);
  }

  private getLoadingPlaces(loadingPlace: LoadingPlace): FormGroup {
    const cargosGroup = loadingPlace.cargo == null ? [] : this.populateCargos(loadingPlace.cargo);
    return this.fd.group({
      id: loadingPlace.id,
      nr: [loadingPlace.nr, Validators.required],
      date: loadingPlace.date,
      location: [loadingPlace.location, Validators.required],
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
    const cargoList = mainForm[nr].get('cargo');
    cargoList.push(this.getCargos(new Cargo()));
  }

  removeCargo(placeNumber:number, cargoNumber: number){
    const mainForm = this.form.get('loadingPlaces')['controls'] as FormArray;
    const cargoList = mainForm[placeNumber].get('cargo');
    cargoList.removeAt(cargoNumber);
  }

  compareById(o1, o2) {
    if (o1 == null || o2 == null) {
      return false;
    }
    return o1.id === o2.id;
  }

  private sendFailureToView(error: any) {
    this.response.alertType = 'alert-danger';
    this.response.message = error;
  }

  submit() {
    Object.keys(this.form.controls).forEach(key => this.form.get(key).markAsDirty());
    this.form.get('loadingPlaces')['controls'].forEach(object => object['controls']['nr'].markAsDirty());
    console.log(this.form)
    if(this.form.invalid == true){
      return;
    }
    this.tripDto = this.form.value;

    this.service.sendObject(this.tripDto, TripService.TRIP_URL).subscribe(response => {
        this.done = true;
      }, (error: HttpErrorResponse) => {
        this.sendFailureToView(error);
      }
    );
  }


  draw() {

    console.log("zmiana");
    const trip = this.form.value;
    console.log(trip);

    const placeStart = trip.placeStart;
    const placeFinish = trip.placeFinish;

    if(placeStart != null){
      this.origin =  this.getLocationFromString(placeStart);
    }
    if(placeFinish != null){
      this.destination = this.getLocationFromString(placeFinish);
    }
    this.viewPoints = [];

    const sortedLoadingPlaces = trip.loadingPlaces.sort((v1,v2) => v1.nr > v2.nr);
    console.log(sortedLoadingPlaces)
    return;
    sortedLoadingPlaces.forEach(lp => this.viewPoints.push({
      location: this.getLocationFromString(lp.location),
      stopover: true
    }));
    console.log("tutaj");
    // const number = new google.maps.DistanceMatrixService();
    const directionsService = new google.maps.DirectionsService();
    directionsService.route({
      origin: this.origin,
      destination: this.destination,
      waypoints: this.viewPoints,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    },(result) =>{
      console.log(result);
      if(result.routes.length >0){
        this.locationResult = [];
        result.routes[0].legs.forEach(location =>{
          const parameter = new LocationParameter(location.start_address,
            location.end_address,
            location.distance.text,
            location.duration.text);
          this.locationResult.push(parameter);
        })
      }
    })

  }

  private getLocationFromString(location: Location){
    console.log(location)
    if(location == null){
      return '';
    }
    return location.postalCode + ' ' +
      location.streetAddress + ' ' +
      location.city + ' ' +
      location.country
  }


}

export class LocationParameter {

  constructor(private startLocation?: string,
              private endLocation?: string,
              private distance?:string,
              private duration?:string){

  }

}
