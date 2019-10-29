import {Component, Input, OnInit} from '@angular/core';
import {TripDto, TripService} from '../trip.service';
import {HttpErrorResponse} from '@angular/common/http';
// import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css']
})
export class TripCardComponent implements OnInit {

  trips = [];
  tripsView = [];
  trip: TripDto;
  isDetails: boolean;

  constructor(private service: TripService) {
  }

  ngOnInit() {
    this.isDetails = false;
    this.service.getObject(TripService.TRIP_URL)
      .subscribe(resourceTrip => {
          this.populateFields(resourceTrip);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
        });
    this.tripsView = this.trips;
  }

  populateFields(resourceTrip): void {
    resourceTrip._embedded.tripDtoes.forEach(trip => {
      this.trips.push(trip);
    });
  }


  openDetails(trip: TripDto) {
    this.trip = trip;
    this.isDetails = true;
  }

  removeUpdateTrip() {
    this.service.getAndRemoveTripForUpdate();
  }
}
