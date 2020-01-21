///<reference path="../../../node_modules/@types/googlemaps/index.d.ts"/>
import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
// import {LocationParameter} from '../trip/trip-form/trip-form.component';
import {Location, TripDto} from '../trip/trip.service';
import {MapsAPILoader} from '@agm/core';
import LatLng = google.maps.LatLng;

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

  drawWithForm(trip,optymalize = false) {
    this.draw(trip.value,optymalize);
    const routes = this.locationResult;
    if(routes.length > 3){
      routes.pop();
      routes.shift();
    }
    let counter = 1;
    routes.forEach(route => {
      const strings = route.end_address.split(',');
      const routeString = strings.join(' ');
      const trip2 = trip.value as TripDto;
      trip2.loadingPlaces.forEach(loc => {
        if(this.getLocationFromString(loc.location).toLowerCase() === routeString.toLowerCase()){
            loc.nr = counter;
            counter++;
            console.log("dupa: " + loc)
        }});
      // if(this.getLocationFromString(trip2.destination).toLowerCase() === routeString.toLowerCase()){
      //   trip2.
      // }
    })
  }

  draw(trip, optymalize = false) {
    this.optimizeWaypoints = optymalize;
    console.log('child')
    console.log(trip)
    const placeStart = trip.placeStart;
    const placeFinish = trip.placeFinish;
    let isCorrect = true;
    trip.loadingPlaces.forEach(place => {
      if(place.nr == null || place.location == null){
        isCorrect = false;

      }
    });
    const sortedLoadingPlaces = trip.loadingPlaces
      .filter(place => place.nr != null && place.location != null)
      .sort((v1, v2) => v1.nr - v2.nr);
    if (placeStart == null || !isCorrect || (placeFinish == null && sortedLoadingPlaces.length == 0)) {
      return;
    }
    // if (placeStart == null || (placeFinish == null && sortedLoadingPlaces.length == 0)) {
    //   return;
    // }
    this.origin = this.getLocationFromString(placeStart);
    this.viewPoints = [];
    console.log(placeFinish);
    this.destination = placeFinish != null
      ? this.getLocationFromString(placeFinish)
      : this.getLocationFromString(sortedLoadingPlaces.pop().location);
    sortedLoadingPlaces.forEach(lp => this.viewPoints.push({
      location: this.getLocationFromString(lp.location),
      stopover: true
    }));
    // return;
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
          console.log(location.end_address);
          fullDistance += location.distance.value;
          fullDuration += location.duration.value;
          const parameter = new LocationParameter(location.start_address,
            location.end_address,
            location.distance.text,
            location.duration.text.replace('godz.','h'),
            location.end_location);
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
      console.log("liczenie numberow")
      const routes = this.locationResult;
      if(routes.length > 3){
        routes.pop();
        routes.shift();
      }

        // let autocomplete = new google.maps.Geocoder();
        // autocomplete.geocode({address: })
        // geocoder
        // geocoder.geocode({})

      let counter = 1;
      for (let i = 0; i < routes.length; i++) {
        let route;
        if(i == 0){
          route = routes[routes.length-1].endLocation;
        }else {
          route = routes[i].startLocation;
        }
        console.log(route)
        const strings = route.split(',');
        const routeString = strings.join('');
        // const trip2 = trip as TripDto;
        trip.loadingPlaces.forEach(loc => {
          maps
          console.log('huj')
          console.log(this.getLocationFromString(loc.location).toLowerCase())
          console.log( routeString.toLowerCase())
          console.log('huj')
          if(this.getLocationFromString(loc.location).toLowerCase() === routeString.toLowerCase()){
            loc.nr = counter;
            counter++;
            console.log("dupa:")
          }});
      }
      routes.forEach(route => {
        const strings = route.startLocation.split(',');
        const routeString = strings.join(' ');
        // const trip2 = trip as TripDto;
        trip.loadingPlaces.forEach(loc => {
          if(this.getLocationFromString(loc.location).toLowerCase() === routeString.toLowerCase()){
            loc.nr = counter;
            counter++;
            console.log("dupa:")
          }});
        // if(this.getLocationFromString(trip2.destination).toLowerCase() === routeString.toLowerCase()){
        //   trip2.
        // }
      })
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
}

export class LocationParameter {
  constructor(private startLocation?: string,
              private endLocation?: string,
              private distance?:string,
              private duration?:string,
              private endLng?:LatLng,
              private startLng?:LatLng){

  }
}
