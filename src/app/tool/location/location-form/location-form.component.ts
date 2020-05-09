import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomResponse} from '../../../car/car.service';
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
  place: google.maps.places.PlaceResult;
  correctForm = false;

  constructor(private tripService: TripService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.findAdress();
  }

  private isValidAddress(addressComponents: google.maps.GeocoderAddressComponent[]): boolean {
    for (const component of addressComponents) {
      if (!component.types.includes('street_number')
        || !component.types.includes('route')
        || !component.types.includes('locality')
        || !component.types.includes('country')
        || !component.types.includes('postal_code')) {
        return false;
      }
    }
    return true;
  }

  findAdress() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchEl.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.correctForm = false;
          const addressComponents = autocomplete.getPlace().address_components;
          if (this.isValidAddress(addressComponents)) {
            this.response.alertType = null;
            this.correctForm = true;
          } else {
            this.response.alertType = 'alert-danger';
            this.response.message = 'Please enter the full address';
          }
        });
      });
    });
  }
}
