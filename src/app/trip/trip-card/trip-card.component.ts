import { Component, OnInit } from '@angular/core';
import {TripService} from '../trip.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css']
})
export class TripCardComponent implements OnInit {

  trips = [];
  tripsView = [];

  constructor(private service: TripService) {
  }

  ngOnInit() {
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
    resourceTrip._embedded.tripDtoes.forEach(driver => {
      this.trips.push(driver);
    });
  }

}
