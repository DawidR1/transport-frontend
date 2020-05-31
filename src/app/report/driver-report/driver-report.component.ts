import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ReportDriver, ReportService} from '../report.service';

@Component({
  selector: 'app-driver-report',
  templateUrl: './driver-report.component.html',
  styleUrls: ['./driver-report.component.css']
})
export class DriverReportComponent implements OnChanges {

  @Input()
  report: ReportDriver;
  imageUrl: string;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
      this.imageUrl = ReportService.PICTURE_URL + this.report.driverDto.imageName;
  }
}
