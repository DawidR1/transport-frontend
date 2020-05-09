import {Component, OnInit} from '@angular/core';
import {TripDto, TripService} from '../trip.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PageEvent} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css']
})
export class TripCardComponent implements OnInit {

  tripsView = [];
  trip: TripDto;
  isDetails = false;
  public pageSize: number;
  public totalItems: number;
  showDataButton = false;
  form: FormGroup;
  isFromDataChange = false;
  isToDataChange = false;

  constructor(private service: TripService, private fd: FormBuilder) {
  }

  ngOnInit() {
    this.isDetails = false;
    this.populateDataFields();
    this.requestTrip();
  }

  populateDataFields() {
    this.form = this.fd.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
  }

  private requestTrip(index: number = 0, size: number = 5) {
    this.service.getObjectPageWithSorting(TripService.TRIP_URL, index, size, 'dateStart')
      .subscribe(resourceTrip => {
          this.populateFields(resourceTrip);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
        });

  }

  populateFields(resource: any): void {
    const trips = [];
    if (resource._embedded != null) {
      resource._embedded.resources.forEach(trip => {
        trips.push(trip);
      });
    }
    this.tripsView = trips;
    this.pageSize = resource.page.size;
    this.totalItems = resource.page.totalElements;
    if (trips.length) {
      this.trip = trips[0];
    }
    this.isDetails = true;
  }


  openDetails(trip: TripDto) {
    this.trip = trip;
    this.isDetails = true;
  }

  removeUpdateTrip() {
    this.service.getAndRemoveTripForUpdate();
  }

  pageEvent($event: PageEvent) {
    this.requestTrip($event.pageIndex);
  }

  filterData() {
    if (this.isFromDataChange && this.isToDataChange) {
      const fromDate = this.form.get('fromDate').value;
      const toDate = this.form.get('toDate').value;
      this.service.getObjectPageFilter(TripService.TRIP_URL, 0, 5, fromDate, toDate)
        .subscribe(resourceTrip => {
            this.tripsView = [];
            this.populateFields(resourceTrip);
          },
          (error: HttpErrorResponse) => {
            this.tripsView = [];
          });
      this.showDataButton = false;
    }
  }
}
