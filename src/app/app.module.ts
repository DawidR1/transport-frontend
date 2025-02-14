
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DriverService } from './driver/driver.service';
import { DriverComponent } from './driver/driver-view/driver.component';
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
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule, MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule, MatListModule,
  MatPaginatorModule, MatProgressSpinnerModule,
  MatRadioModule,
  MatTableModule
} from '@angular/material';
import { CompanyReportComponent } from './report/company-report/company-report.component';
import { DriverReportComponent } from './report/driver-report/driver-report.component';
import { LocationFormComponent } from './tool/location/location-form/location-form.component';
import { DriverDetailsViewComponent } from './driver/driver-details-view/driver-details-view.component';
import { AuthComponent } from './auth/auth.component';
import {JwtInterceptor} from './auth/JwtFilter';
import {ErrorInterceptor} from './auth/ErrorFilter';
import {FinishedPipe} from './finished.pipe';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {AgmCoreModule} from '@agm/core';
import {AgmDirectionModule} from 'agm-direction';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MapComponent} from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DriverComponent,
    CarComponent,
    CarFormComponent,
    DriverFormComponent,
    TripComponent,
    TripCardComponent,
    TripFormComponent,
    TripViewComponent,
    ToStringPipe,
    FinishedPipe,
    DriverParserPipe,
    ReportComponent,
    CompanyReportComponent,
    DriverReportComponent,
    LocationFormComponent,
    DriverDetailsViewComponent,
    AuthComponent,
    MapComponent
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
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDatepickerModule,
    ScrollingModule,
    AgmCoreModule.forRoot({
      language: 'en',
      apiKey: '',
      libraries: ['places']
    }),
    AgmDirectionModule,
    MatProgressBarModule
  ],
  entryComponents: [
    ReportComponent
  ],
  providers: [
    DriverService,
    HttpClient,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
