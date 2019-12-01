import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ReportCompany, ReportDriver, ReportService} from './report.service';
import {Router} from '@angular/router';
import {Driver, DriverService} from '../driver/driver.service';
import {CompanyReportComponent} from './company-report/company-report.component';


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


  closeResult: string;
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
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      const startDate = this.form.get('start').value;
      const endDate = this.form.get('end').value;
      const format = this.form.get('format').value;
      const driverId = this.form.get('driver').value;
      if (format === 'PDF') {
        this.showReportDriver = false;
        this.service.downloadDriverInPdf(startDate, endDate, format, driverId);
      } else {
        this.service.downloadDriverInJson(startDate, endDate, format, driverId).subscribe(resource => {
          console.log(resource);
          this.reportDriver = resource;
          this.showReportDriver = true;
        });
      }
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openCompany(content) {
    this.isDisabled = true;
    this.showReportDriver = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then((result) => {
        const startDate = this.form.get('start').value;
        const endDate = this.form.get('end').value;
        const format = this.form.get('format').value;
        if (format === 'PDF') {
          this.showReport = false;
          this.service.downloadCompanyInPdf(startDate, endDate, format);
        } else {
          this.service.downloadCompanyInJson(startDate, endDate, format).subscribe(resource => {
            console.log(resource);
            this.reportCompany = resource;
            this.showReport = true;
          });
        }
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
}
