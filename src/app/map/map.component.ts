// /<reference path="../../../node_modules/@types/googlemaps/index.d.ts"/>
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Location, TripDto} from '../trip/trip.service';
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  lat;
  lng;
  origin;
  destination;
  viewPoints = [];
  locationResult = [];
  distance;
  duration;
  @Input()
  trip: TripDto;
  @ViewChild('location', {static: false})
  searchEl: ElementRef;
  @Output()
  event = new EventEmitter<TripDto>();

  private optimizationWaypoints = false;
  private searchAddress: string;

  constructor(private mapsApiLoader: MapsAPILoader) {
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

  draw(trip, optimization = false) {
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
      return;
    }
    this.origin = this.getLocationInText(trip.placeStart);
    this.viewPoints = [];
    this.destination = trip.placeFinish != null
      ? this.getLocationInText(trip.placeFinish)
      : this.getLocationInText(sortedLoadingPlaces.pop().location);
    sortedLoadingPlaces.forEach(lp => {
      this.viewPoints.push({
        location: this.getLocationInText(lp.location),
        stopover: true
      });
    });
    const directionsService = new google.maps.DirectionsService();
    directionsService.route({
      optimizeWaypoints: optimization,
      origin: this.origin,
      destination: this.destination,
      waypoints: this.viewPoints,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    }, (result) => {
      this.optimizationWaypoints = optimization;
      this.populateMapContent(result);
      this.performOptimization(optimization, trip);
    });
  }

  private performOptimization(optimization, trip) {
    if (optimization === false) {
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
  }

  private populateMapContent( result) {
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
    console.log(location);
    if (location == null) {
      return '';
    }
    return location.streetAddress + ', ' +
      location.postalCode + ' ' +
      location.city + ', ' +
      location.country;
  }

  opt() {
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
