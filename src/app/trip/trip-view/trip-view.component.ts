import {TripDto, TripService} from '../trip.service';
import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip-view.component.html',
  styleUrls: ['./trip-view.component.css']
})
export class TripViewComponent implements OnInit {

  @Input()
  tripView: TripDto;

  constructor(private service: TripService, private router: Router, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  updateTrip(tripView: TripDto) {
    this.service.addTripToUpdateForm(tripView);
    this.router.navigate(['trip-form']);
  }

  openMap(content) {
    this.modalService.open(content, {
      size: 'xl'
    });
  }
}
