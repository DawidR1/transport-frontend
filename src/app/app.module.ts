
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainNavsComponent } from './main-navs/main-navs.component';
import { DriverService } from './driver/driver.service';
import { DriverComponent } from './driver/view/driver.component';
import { CarComponent } from './car/view/car.component';
import {CarFormComponent} from './car/car-form/car-form.component';
import {DriverFormComponent} from './driver/driver-form/driver-form.component';
import { TripComponent } from './trip/trip.component';
import { TripCardComponent } from './trip/trip-card/trip-card.component';
import { TripFormComponent } from './trip/trip-form/trip-form.component';
import { TripViewComponent } from './trip/trip-view/trip-view.component';
import { ToStringPipe } from './to-string.pipe';
import { DriverParserPipe } from './driver-parser.pipe';
import { ReportComponent} from './report/report.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatTableModule} from '@angular/material';
import { CompanyReportComponent } from './report/company-report/company-report.component';
import { DriverReportComponent } from './report/driver-report/driver-report.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainNavsComponent,
    DriverComponent,
    CarComponent,
    CarFormComponent,
    DriverFormComponent,
    TripComponent,
    TripCardComponent,
    TripFormComponent,
    TripViewComponent,
    ToStringPipe,
    DriverParserPipe,
    ReportComponent,
    CompanyReportComponent,
    DriverReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule
  ],
  entryComponents: [
    ReportComponent
  ],
  providers: [DriverService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
