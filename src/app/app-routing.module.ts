import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DriverComponent} from './driver/driver-view/driver.component';
import {CarComponent} from './car/view/car.component';
import {CarFormComponent} from './car/car-form/car-form.component';
import {DriverFormComponent} from './driver/driver-form/driver-form.component';
import {TripComponent} from './trip/trip.component';
import {TripFormComponent} from './trip/trip-form/trip-form.component';
import {TripViewComponent} from './trip/trip-view/trip-view.component';
import {ReportComponent} from './report/report.component';
import {CompanyReportComponent} from './report/company-report/company-report.component';
import {LocationFormComponent} from './tool/location/location-form/location-form.component';
import {DriverDetailsViewComponent} from './driver/driver-details-view/driver-details-view.component';
import {AuthComponent} from './auth/auth.component';
import {AuthorizationService} from './auth/Authorization.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationService],
    children: [
      {
        path: '',
          redirectTo: 'trip',
        pathMatch: 'full',

      },
      {
        path: 'driver',
        component: DriverComponent,
      },
      {
        path: 'driver-form',
        component: DriverFormComponent
      },
      {
        path: 'driver-form-update',
        component: DriverFormComponent
      },
      {
        path: 'car',
        component: CarComponent
      },
      {
        path: 'car-form',
        component: CarFormComponent
      },
      {
        path: 'car-form-update',
        component: CarFormComponent
      },
      {
        path: 'trip',
        component: TripComponent
      },
      {
        path: 'trip-form',
        component: TripFormComponent
      },
      {
        path: 'trip-view',
        component: TripViewComponent
      },
      {
        path: 'report',
        component: ReportComponent
      },
      {
        path: 'company-report',
        component: CompanyReportComponent
      },
      {
        path: 'location-form',
        component: LocationFormComponent
      },
      {
        path: 'driver-details-view',
        component: DriverDetailsViewComponent
      },
      {
        path: 'main',
        component: TripComponent
      }
    ]
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
