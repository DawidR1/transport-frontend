///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>
import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {Cargo, LoadingPlace, Location, TripDto, TripFormData, TripService, TripStatus} from '../trip.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DriverService} from '../../driver/driver.service';
import {CarService, CustomResponse} from '../../car/car.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {MapComponent} from '../../map/map.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocationFormComponent} from '../../tool/location/location-form/location-form.component';
import {Router} from '@angular/router';

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
  isMainInformationCollapse = true;
  isAdditionalInformationCollapse = true;
  isLoadPlaceInformationCollapse = true;

  @ViewChild(MapComponent, {static: false}) mapComponent: MapComponent;
  @ViewChild('content', {static: false}) contentRef: ElementRef;
  private locations: Array<Location>;
  locationForm: FormGroup;
  location: any;
  private message: string;

  constructor(private service: TripService,
              private fd: FormBuilder,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private modalService: NgbModal,
              private router: Router) {
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
    this.locations = locations;
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
    console.log(this.form.get('loadingPlaces')['controls'][0]['controls']['nr'].invalid);
  }

  removeLoadingPlace(i: number) {
    const loadingPlaces = this.form.get('loadingPlaces') as FormArray;
    loadingPlaces.removeAt(i);
    this.mapComponent.draw(this.form.value);
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

  removeCargo(placeNumber: number, cargoNumber: number) {
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
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key).markAsDirty();
      if (this.form.get(key).invalid) {
        this.isMainInformationCollapse = false;
      }
    });
    this.form.get('loadingPlaces')['controls'].forEach(object => {
      Object.keys(object['controls']).forEach(key => {
        object['controls'][key].markAsDirty();
        if (object['controls'][key].invalid) {
          this.isLoadPlaceInformationCollapse = false;
        }
      });
    });

    console.log(this.form.get('loadingPlaces')['controls']);
    if (this.form.invalid === true) {
      console.log(this.form);
      return;
    }
    this.tripDto = this.form.value;

    this.service.sendObject(this.tripDto, TripService.TRIP_URL).subscribe(response => {
        this.done = true;
        this.message = 'Saved';
      this.response.alertType = 'alert-success';
      this.modalService.open(this.contentRef);
        setTimeout(() => {
          this.modalService.dismissAll();
          this.router.navigate(['trip']);
        }, 3000);
      }, (error: HttpErrorResponse) => {
      this.response.alertType = 'alert-danger';
      this.message = error.message;
      this.modalService.open(this.contentRef);
      }
    );
  }

  openLocationModal() {

    this.locationForm = this.fd.group({
      streetAddress: '',
      postalCode: '',
      city: '',
      country: ['', Validators.required]
    });
    this.modalService.open(LocationFormComponent, {}).result.then(results => {
      const geocoder = new google.maps.Geocoder();
      const location = this.locationForm.value as Location;
      const addressComponents = results.address_components;
      let streetAddress = '';
      let route = '';
      addressComponents.forEach(component => {
        if (component.types.includes('street_number')) {
          streetAddress = component.long_name;
        } else if (component.types.includes('route')) {
          route = component.long_name;
        } else if (component.types.includes('locality')) {
          location.city = component.long_name;
        } else if (component.types.includes('country')) {
          location.country = component.long_name;
        } else if (component.types.includes('postal_code')) {
          location.postalCode = component.long_name;
        }
      });
      location.streetAddress = route + ' ' + streetAddress;
      geocoder.geocode({address: this.getLocationFromString(location)}, (results2 => {
        location.latLng = results2[0].geometry.location.lat() + ',' + results2[0].geometry.location.lng();
      }));
      this.locations.push(this.locationForm.value);
    }, (reason) => {
    });

  }

  getLocationFromString(location: Location) {
    console.log(location);
    if (location == null) {
      return '';
    }
    return location.streetAddress + ', ' +
      location.postalCode + ' ' +
      location.city + ', ' +
      location.country;
  }

  draw(value: any) {
    this.mapComponent.draw(value);
  }
}

