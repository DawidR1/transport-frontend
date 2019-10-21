import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DriverComponent} from './driver/view/driver.component';
import {CarComponent} from './car/view/car.component';
import {CarFormComponent} from './car/car-form/car-form.component';
import {DriverFormComponent} from './driver/driver-form/driver-form.component';
import {TripComponent} from './trip/trip.component';
import {TripFormComponent} from './trip/trip-form/trip-form.component';
import {TripViewComponent} from './trip/trip-view/trip-view.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
},
  {
    path: 'driver',
    component: DriverComponent
  },
  {
    path: 'driver-form',
    component:  DriverFormComponent
  },
  {
    path: 'driver-form-update',
    component:  DriverFormComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
