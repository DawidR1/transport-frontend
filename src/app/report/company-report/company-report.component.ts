import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReportCompany} from '../report.service';
import {TripDto} from '../../trip/trip.service';

@Component({
  selector: 'app-company-report',
  templateUrl: './company-report.component.html',
  styleUrls: ['./company-report.component.css']
})
export class CompanyReportComponent implements OnChanges{
  @Input()
   report: ReportCompany;
  trips: Array<TripDto> = new Array<TripDto>();
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.trips = new Array<TripDto>();
    this.report.reportDrivers
      .map(rep => rep.trips.forEach(trip => this.trips.push(trip)));
  }
}
