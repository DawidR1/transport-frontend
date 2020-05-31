import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ReportCompany, ReportDriver, ReportService} from './report.service';
import {Router} from '@angular/router';
import {Driver, DriverService} from '../driver/driver.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  form: FormGroup;
  reportCompany: ReportCompany;
  reportDriver: ReportDriver;
  drivers: Array<Driver>;


  isDisabled: boolean;
  showReport: boolean;
  showReportDriver: boolean;

  constructor(private service: ReportService,
              private modalService: NgbModal,
              private fd: FormBuilder,
              private router: Router) {
  }


  ngOnInit() {
    this.form = this.fd.group({
      start: '',
      end: '',
      format: '',
      driver: ''
    });
  }

  openDriver(content) {
    this.isDisabled = false;
    this.showReport = false;
    this.service.getObject(DriverService.RESOURCE_DRIVER_URL).subscribe(resource => {
      this.drivers = resource._embedded.driverDtoes;
    });
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result
      .then(this.showDriverContent(), (reason) => {
      });
  }


  private showDriverContent() {
    return (result) => {
      const startDate = this.form.get('start').value;
      const endDate = this.form.get('end').value;
      let format = this.form.get('format').value;
      const driverId = this.form.get('driver').value;
      if(startDate === '' || endDate === '' || driverId === ''){
        return;
      }
      if (format === 'PDF') {
        this.showReportDriver = false;
        this.service.downloadDriverInPdf(startDate, endDate, format, driverId).subscribe(resource => {
          const blob = new Blob([resource], {type: 'application/pdf'});
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        });
      } else {
        format = 'JSON';
        this.service.downloadDriverInJson(startDate, endDate, format, driverId).subscribe(resource => {
          this.reportDriver = resource;
          this.showReportDriver = true;
        });
      }
    };
  }

  openCompany(content) {
    this.isDisabled = true;
    this.showReportDriver = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(this.showCompanyContent(), (reason) => {
      }
    );
  }

  private showCompanyContent() {
    return (result) => {
      const startDate = this.form.get('start').value;
      const endDate = this.form.get('end').value;
      let format = this.form.get('format').value;
      if(startDate === '' || endDate === ''){
        return;
      }
      if (format === 'PDF') {
        this.showReport = false;
        this.service.downloadCompanyInPdf(startDate, endDate, format).subscribe(resource => {
          const blob = new Blob([resource], {type: 'application/pdf'});
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        });
      } else {
        format = 'JSON';
        this.service.downloadCompanyInJson(startDate, endDate, format).subscribe(resource => {
          this.reportCompany = resource;
          this.showReport = true;
        });
      }
    };
  }
}
