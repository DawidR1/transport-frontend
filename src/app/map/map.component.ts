import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Location, TripDto} from '../trip/trip.service';
import {MapsAPILoader} from '@agm/core';
import {CustomResponse} from "../car/car.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {


  @Input() trip: TripDto;
  @Input() isForm = false;
  @ViewChild('location', {static: false}) searchEl: ElementRef;
  @Output() event = new EventEmitter<TripDto>();
  @ViewChild('error', {static: false}) contentRef: ElementRef;

  response = new CustomResponse();
  lat;
  lng;
  origin = '';
  destination;
  viewPoints = [];
  locationResult = [];
  distance;
  duration;
  loaded = false;
  loading: boolean;
  optimizationWaypoints = false;
  showRoute = false;
  zoom: any;

  constructor(private mapsApiLoader: MapsAPILoader, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.setCurrentLocation();
    this.draw(this.trip);
  }

  private setCurrentLocation() {

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    } else {
      this.lat = 51.950155;
      this.lng = 18.709522;
    }
  }

  public draw(trip: TripDto, optimization = false) {
    this.setLoaded(false);
    this.createMap(trip, optimization);
  }

  private createMap(trip, optimization) {
    let isCorrect = true;
    trip.loadingPlaces.forEach(place => {
      if (place.nr == null || place.location == null) {
        isCorrect = false;
      }
    });
    const sortedLoadingPlaces = trip.loadingPlaces
      .filter(place => place.nr != null && place.location != null)
      .sort((v1, v2) => v1.nr - v2.nr);
    if (trip.placeStart == null || !isCorrect || (trip.placeFinish == null && sortedLoadingPlaces.length === 0)) {
      this.setLoaded(true);
      this.loading = false;
      return;
    }
    const origin = this.getLocationInText(trip.placeStart);
    const viewPoints = [];
    const destination = trip.placeFinish != null
      ? this.getLocationInText(trip.placeFinish)
      : this.getLocationInText(sortedLoadingPlaces.pop().location);
    sortedLoadingPlaces.forEach(lp => {
      viewPoints.push({
        location: this.getLocationInText(lp.location),
        stopover: true
      });
    });
    setTimeout(() => {
      new google.maps.DirectionsService()
        .route({
          optimizeWaypoints: optimization,
          origin: origin,
          destination: destination,
          waypoints: viewPoints,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        }, this.handleResponseFromDirectionApi(optimization, origin, destination, viewPoints, trip));
    }, 500);
  }

  private handleResponseFromDirectionApi(optimization, origin: string, destination: string, viewPoints: any[], trip) {
    return (result, status) => {
      if (status === 'OK') {
        this.optimizationWaypoints = optimization;
        this.origin = origin;
        this.destination = destination;
        this.viewPoints = viewPoints;
        this.populateMapContent(result);
        this.showRoute = true;
        this.performOptimization(optimization, trip);
      } else if (status === 'REQUEST_DENIED') {
        this.displayWindowWithError('Google Maps were switched off');
      } else if (status === 'OVER_QUERY_LIMIT') {
        this.displayWindowWithError('The request quota have exceeded');
      } else {
        this.displayWindowWithError('Error during loading Google Maps');
      }
    };
  }

  private displayWindowWithError(message: string) {
    this.response.alertType = 'alert-danger';
    this.response.message = message;
    this.loading = false;
    this.setLoaded(true);
    this.modalService.open(this.contentRef, {size: 'lg'});
  }

  private performOptimization(optimization, trip) {
    if (optimization === false) {
      this.setLoaded(true);
      return;
    }
    const routes = Object.assign([], this.locationResult);
    let counter = 1;
    for (let i = 1; i < routes.length; i++) {
      let route = routes[i].startLocation;
      route = route.split(' ').join('').split(',').join('');
      trip.loadingPlaces.forEach(loc => {
        if (this.getLocationFormatFromString(loc.location).toLowerCase() === route.toLowerCase()) {
          loc.nr = counter;
          counter++;
        }
      });
    }
    this.event.next(trip);
    this.loading = false;
    this.setLoaded(true);
  }

  private setLoaded(b: boolean) {
    this.loaded = b;
    this.zoom = 5;
  }

  private populateMapContent(result) {
    let fullDistance = 0;
    let fullDuration = 0;
    if (result.routes.length > 0) {
      this.locationResult = [];
      result.routes[0].legs.forEach(location => {
        fullDistance += location.distance.value;
        fullDuration += location.duration.value;
        const parameter = new LocationParameter(location.start_address,
          location.end_address,
          location.distance.text,
          location.duration.text,
          location.end_location.lat() + ',' + location.end_location.lng(),
          location.start_location.lat() + ',' + location.start_location.lng());
        this.locationResult.push(parameter);
      });
    }

    fullDistance = fullDistance / 1000;
    fullDistance = Math.ceil(fullDistance);
    this.distance = fullDistance + ' km';
    const h = Math.floor(fullDuration / 3600);
    const m = Math.floor(fullDuration % 3600 / 60);
    this.duration = h + ' hours ' + m + ' mins';
  }

  private getLocationInText(location: Location) {

    if (location == null) {
      return '';
    }
    return location.streetAddress + ', ' +
      location.postalCode + ' ' +
      location.city + ', ' +
      location.country;
  }

  opt() {
    this.loading = true;
    this.draw(this.trip, true);
  }

  private getLocationFormatFromString(location: Location) {
    return location.streetAddress.split(' ').join('') +
      location.postalCode.split(' ').join('') +
      location.city.split(' ').join('') +
      location.country.split(' ').join('');
  }
}

export class LocationParameter {
  constructor(private startLocation?: string,
              private endLocation?: string,
              private distance?: string,
              private duration?: string,
              private endLng?: string,
              private startLng?: string) {

  }
}
