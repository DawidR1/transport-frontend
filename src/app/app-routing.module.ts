import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DriverComponent} from './driver/component/driver.component';
import {CarComponent} from './car/view/car.component';
import {CarFormComponent} from './car/car-form/car-form.component';

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
    path: 'car',
    component: CarComponent
  },
  {
    path: 'driver-form',
    component: CarFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
