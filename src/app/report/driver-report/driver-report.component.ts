import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReportCompany, ReportDriver, ReportService} from '../report.service';
import {TripDto} from '../../trip/trip.service';

@Component({
  selector: 'app-driver-report',
  templateUrl: './driver-report.component.html',
  styleUrls: ['./driver-report.component.css']
})
export class DriverReportComponent implements OnChanges {

  @Input()
  report: ReportDriver;
  imageUrl: string;
  constructor(private service: ReportService) { }

  ngOnChanges(changes: SimpleChanges) {
      this.imageUrl = ReportService.PICTURE_URL + this.report.driverDto.imageName;
  }
}
