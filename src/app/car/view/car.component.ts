import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Car, CarService} from '../car.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatPaginator, PageEvent} from '@angular/material';
import {merge} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  // @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  carsView: Array<Car> = new Array<Car>();
  cars = [];
  private _filter: string;
  pageSize: number;
  totalItems: number;
  isLoadingResults: boolean;
  // displayedColumns = ['plate', 'brand', 'model'];

  public get filter(): string {
    return this._filter;
  }

  public set filter(value: string) {
    this._filter = value.toLowerCase();
    // this.filterChangingSet();
  }

  constructor(private service: CarService, private router: Router) {

  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.requestObjects();
    this.isLoadingResults = false;
  }

  // ngAfterViewInit(): void {
  //   this.isLoadingResults = true;
  //   this.requestObjects();
  //   this.isLoadingResults = false;
  // }


  // ngAfterViewInit(): void {
  //   merge(this.paginator).pipe((
  //     startWith({}),
  //       switchMap(() => {
  //         console.log('tu')
  //
  //         return this.service.getObjectPage(CarService.CAR_URL, 0);
  //       }))).subscribe(resource => {
  //       console.log(resource)
  //       resource._embedded.resources.forEach(car => {
  //         this.cars.push(car);
  //       });
  //       this.pageSize = resource.page.size;
  //       this.totalItems = resource.page.totalElements;
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.log(error.status);
  //     }
  //   );
  //   this.carsView = this.cars;
  // }


  private requestObjects(index: number = 0) {
    let cars = new Array<Car>();
    this.service.getObjectPage(CarService.CAR_URL, index).subscribe(resource => {
        resource._embedded.resources.forEach(car => {
          cars.push(car);
        });
        this.pageSize = resource.page.size;
        this.totalItems = resource.page.totalElements;
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
      }
    );
    this.carsView = cars;
    console.log(this.carsView);

  }

  saveInService(car: Car) {
    this.service.addCar(car);
    this.router.navigate(['car-form-update']);
  }

  // private filterChangingSet() {
  //   if (this.filter === '') {
  //     this.carsView = this.cars;
  //   } else {
  //     this.carsView = this.cars.filter(car => car.plate.toLowerCase().includes(this.filter)
  //       || car.model.toLowerCase().includes(this.filter)
  //       || car.brand.toLowerCase().includes(this.filter));
  //   }
  // }

  pageEvent2($event: PageEvent) {
    this.isLoadingResults = true;

    this.requestObjects($event.pageIndex);
    this.isLoadingResults = false;

    console.log($event.pageIndex);
  }
}

