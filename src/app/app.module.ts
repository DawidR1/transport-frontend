import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainNavsComponent } from './main-navs/main-navs.component';
import { DriverService } from './driver/driver.service';
import { DriverComponent } from './driver/component/driver.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DriverComponent,
    NavbarComponent,
    MainNavsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [DriverService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
