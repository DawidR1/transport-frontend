import {Injectable} from '@angular/core';
import {AppService} from '../app.service';
import {Driver} from '../driver/driver.service';
import {TripDto} from '../trip/trip.service';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UrlSerializer} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends AppService {

  public static PICTURE_URL = AppService.WEB_URL + 'file/';
  private static REPORT_URL = 'report/';
  public static DRIVER_REPORT_URL = AppService.WEB_URL + 'driver/';
  public static COMPANY_REPORT_URL = AppService.WEB_URL + 'company/' + ReportService.REPORT_URL;
  private static START_DATE_PARAM = 'start';
  private static END_DATE_PARAM = 'end';
  private static FORMAT_PARAM = 'format';

  constructor(http: HttpClient, private serializer: UrlSerializer) {
    super(http);
  }

  public getReportForCompany(startDate: string, endDate: string, format: string): Observable<HttpResponse<any>> {
    const params = this.createParams(startDate, endDate, format);
    return this.http.get<any>(ReportService.COMPANY_REPORT_URL, {params});
  }

  createUrlToCompanyReport(startDate: any, endDate: any, format: string) {
    return ReportService.COMPANY_REPORT_URL + '?format=' + format + '&start=' + startDate + '&end=' + endDate;
  }

  private createParams(startDate: string, endDate: string, format: string) {
    return new HttpParams()
      .set(ReportService.START_DATE_PARAM, startDate)
      .set(ReportService.END_DATE_PARAM, endDate)
      .set(ReportService.FORMAT_PARAM, format);
  }

  downloadCompanyInPdf(startDate: string, endDate: string, format: string) {
    const url = this.createUrlToCompanyReport(startDate, endDate, format);
    return this.getObjectBlob(url);
  }

  downloadDriverInPdf(startDate: string, endDate: string, format: string, driverId: number) {
    const url = this.createUrlToDriverReport(startDate, endDate, format, driverId);
    console.log(url);
    return this.getObjectBlob(url);
  }

  private createUrlToDriverReport(startDate: string, endDate: string, format: string, driverId: number) {
    return ReportService.DRIVER_REPORT_URL + driverId + '/report'
      + '?format=' + format + '&start=' + startDate + '&end=' + endDate;
  }

  downloadDriverInJson(startDate: any, endDate: any, format: any, driverId: any): Observable<any>{
    const url = this.createUrlToDriverReport(startDate, endDate, format, driverId);
    return this.getObject(url);
  }

  downloadCompanyInJson(startDate: any, endDate: any, format: any) {
    let url = this.createUrlToCompanyReport(startDate, endDate, format);
    return this.getObject(url);
  }
}

export class ReportDriver {
  constructor(public driverDto: Driver,
              public numberOfTrips: number,
              public salary: number,
              public trips: Array<TripDto>,
              public start: string,
              public end: string) {
  }
}

export class ReportCompany {
  constructor(public companyIncome: number,
              public reportDrivers: Array<ReportDriver>,
              public companyNumberOfTrips: number,
              public start: string,
              public end: string) {
  }
}
