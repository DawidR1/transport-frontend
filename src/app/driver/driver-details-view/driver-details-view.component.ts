import { Component, OnInit } from '@angular/core';
import {Driver, DriverService} from '../driver.service';

@Component({
  selector: 'app-driver-details-view',
  templateUrl: './driver-details-view.component.html',
  styleUrls: ['./driver-details-view.component.css']
})
export class DriverDetailsViewComponent implements OnInit {
  driver: Driver;

  constructor(private service: DriverService) { }

  ngOnInit() {
    this.driver = this.service.getAndRemoveCarDetails();
  }
}
