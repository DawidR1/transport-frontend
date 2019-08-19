import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainNavsComponent } from './main-navs/main-navs.component';
import { DriverService } from './driver/driver.service';
import { DriverComponent } from './driver/component/driver.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CarComponent } from './car/view/car.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CarFormComponent} from './car/car-form/car-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainNavsComponent,
    DriverComponent,
    CarComponent,
    CarFormComponent
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
