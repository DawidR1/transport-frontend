import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../auth/AuthenticationService';
import {User} from '../model/User';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  private user: User;

  constructor(private service: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.service.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}
