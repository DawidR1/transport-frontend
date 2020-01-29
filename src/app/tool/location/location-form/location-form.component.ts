import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomResponse} from '../../../car/car.service';
import {ToolService} from '../../tool.service';
import {Location, TripService} from '../../../trip/trip.service';
import {MapsAPILoader} from '@agm/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class LocationFormComponent implements OnInit {

  form: FormGroup;
  location: Location = new Location();
  response = new CustomResponse();

  @ViewChild('location', {static: false})
  searchEl: ElementRef;
  private place: google.maps.places.PlaceResult;
  correctForm = false;

  constructor(private service: ToolService,
              private tripService: TripService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.findAdress();
  }

  findAdress() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchEl.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.correctForm = false;
          this.place = autocomplete.getPlace();
          const addressComponents = this.place.address_components;
          let streetAddress = false;
          let route = false;
          let city = false;
          let country = false;
          let postalCode = false;
          console.log(addressComponents)
          addressComponents.forEach(component => {
            if (component.types.includes('street_number')) {
              streetAddress = true;
            } else if (component.types.includes('route')) {
              route = true;
            } else if (component.types.includes('locality')) {
              city = true;
            } else if (component.types.includes('country')) {
              country = true;
            } else if (component.types.includes('postal_code')) {
              postalCode = true;
            }
          });
          if (streetAddress && route && city && country && postalCode) {
            this.response.alertType = null;
            this.correctForm = true;
          }else {
            this.response.alertType = 'alert-danger';
            this.response.message = 'Please enter the full address';
          }
        });
      });
    });
  }
}
