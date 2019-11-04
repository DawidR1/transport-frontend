import { Component, OnInit } from '@angular/core';
import {CarService} from '../../car/car.service';
import {ToolService} from '../tool.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Location, TripService} from '../../trip/trip.service';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  location: Array<Location>;
  private pageSize: number;
  private totalItems: number;
  constructor(private service: ToolService, private router: Router) { }

  ngOnInit() {
    this.requestObjects();
  }

  saveInService(location: Location) {
    this.service.addLocation(location);
    this.router.navigate(['location-form']);
  }

  pageEvent($event: PageEvent) {
    this.requestObjects($event.pageIndex);
  }

  private requestObjects(pageIndex: number = 0) {
    const location = new Array<Location>();
    this.service.getObjectPage(TripService.LOCATION_URL, pageIndex).subscribe(resource => {
        resource._embedded.resources.forEach(data => {
          location.push(data);
        });
        this.pageSize = resource.page.size;
        this.totalItems = resource.page.totalElements;
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );
    this.location = location;
  }
}
