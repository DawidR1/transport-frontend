import {TripDto, TripService} from '../trip.service';
import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip-view.component.html',
  styleUrls: ['./trip-view.component.css']
})
export class TripViewComponent implements OnInit {

  @Input()
  tripView: TripDto;
  constructor(private service: TripService,  private router: Router) { }

  ngOnInit() {
  }

  updateTrip(tripView: TripDto) {
    this.service.addTripToUpdateForm(tripView);
    this.router.navigate(['trip-form']);
  }

  showInMaps(tripView: TripDto) {
    const locations = [tripView.placeStart];
    tripView.loadingPlaces.forEach(place => locations.push(place.location));
    locations.push(tripView.placeFinish);
    console.log(locations)
    this.service.showInMaps(locations);
  }
}
