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

  private optimizeWaypoints = false;
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

  drawWithForm(trip, optymalize = false) {
    this.draw(trip.value, optymalize);
    const routes = this.locationResult;
    if (routes.length > 3) {
      routes.pop();
      routes.shift();
    }
    let counter = 1;
    routes.forEach(route => {
      const strings = route.end_address.split(',');
      const routeString = strings.join(' ');
      const trip2 = trip.value as TripDto;
      trip2.loadingPlaces.forEach(loc => {
        if (this.getLocationFromString(loc.location).toLowerCase() === routeString.toLowerCase()) {
          loc.nr = counter;
          counter++;
          console.log('dupa: ' + loc);
        }
      });
    });
  }

  draw(trip, optymalize = false) {
    this.optimizeWaypoints = optymalize;
    console.log('child');
    console.log(trip);
    const placeStart = trip.placeStart;
    const placeFinish = trip.placeFinish;
    let isCorrect = true;
    trip.loadingPlaces.forEach(place => {
      if (place.nr == null || place.location == null) {
        isCorrect = false;
        console.log('null');
      }
    });
    const sortedLoadingPlaces = trip.loadingPlaces
      .filter(place => place.nr != null && place.location != null)
      .sort((v1, v2) => v1.nr - v2.nr);
    if (placeStart == null || !isCorrect || (placeFinish == null && sortedLoadingPlaces.length === 0)) {
      console.log('null2');
      return;
    }
    const originStrings = trip.placeStart.latLng.split(',');
    this.origin = {lat: +originStrings[0], lng: +originStrings[1]}; //new google.maps.LatLng(originStrings[0], originStrings[1]);
    this.viewPoints = [];
    console.log(placeFinish);

    const destinationStrings = placeFinish != null
      ? placeFinish.latLng.split(',') // this.getLocationFromString(placeFinish)
      : sortedLoadingPlaces.pop().location.latLng(',');  // this.getLocationFromString(sortedLoadingPlaces.pop().location);

    this.destination = {lat: +destinationStrings[0], lng: +destinationStrings[1]};  //new LatLng(destinationStrings[0], destinationStrings[1]);
    sortedLoadingPlaces.forEach(lp => {
      const locationStrings = lp.location.latLng.split(',');
      this.viewPoints.push({
        location: {lat: +locationStrings[0], lng: +locationStrings[1]}, //new LatLng(locationStrings[0], locationStrings[1]),
        stopover: true
      });
    });
    console.log('agter sortedloadingplace');
    const directionsService = new google.maps.DirectionsService();
    directionsService.route({
      optimizeWaypoints: this.optimizeWaypoints,
      origin: this.origin,
      destination: this.destination,
      waypoints: this.viewPoints,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    }, (result) => {
      console.log(result);
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
          // console.log(location.end_location)
          this.locationResult.push(parameter);
        });

      }

      fullDistance = fullDistance / 1000;
      fullDistance = Math.ceil(fullDistance);
      console.log(fullDistance);
      this.distance = fullDistance + ' km';
      console.log(this.distance);
      let h = Math.floor(fullDuration / 3600);
      let m = Math.floor(fullDuration % 3600 / 60);
      this.duration = h + ' h ' + m + ' min';


      console.log('liczenie numberow');
      if(optymalize === false){
        return;
      }
      const routes = Object.assign([], this.locationResult);
      let counter = 1;
      for (let i = 1; i < routes.length; i++) {
        let route = routes[i].startLocation;

        console.log('routeString');
        console.log(route);
        console.log('routeString');
         route = route.split(' ').join('');
         route = route.split(',').join('');

        trip.loadingPlaces.forEach(loc => {
          console.log(this.getLocationFormatFromString(loc.location).toLowerCase());
          console.log(route.toLowerCase());
          if (this.getLocationFormatFromString(loc.location).toLowerCase() === route.toLowerCase()) {
            loc.nr = counter;
            counter++;
            console.log('dupa:');
          }
        });
      }
      this.event.next(trip);
    });
  }

  private getLocationFromString(location: Location) {
    console.log(location);
    if (location == null) {
      return '';
    }
    return location.streetAddress + ' ' +
      location.postalCode + ' ' +
      location.city + ' ' +
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
