import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainNavsComponent } from './main-navs/main-navs.component';
import { DriverService } from './driver/driver.service';
import { DriverComponent } from './driver/view/driver.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CarComponent } from './car/view/car.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CarFormComponent} from './car/car-form/car-form.component';
import {DriverFormComponent} from './driver/driver-form/driver-form.component';
import { TripComponent } from './trip/trip.component';
import { TripCardComponent } from './trip/trip-card/trip-card.component';
import { TripFormComponent } from './trip/trip-form/trip-form.component';
import { TripViewComponent } from './trip/trip-view/trip-view.component';
import { ToStringPipe } from './to-string.pipe';
import { DriverParserPipe } from './driver-parser.pipe';

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
    DriverParserPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DriverService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
