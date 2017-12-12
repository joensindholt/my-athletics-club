import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: User;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.userService.loggedInUser$.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.userService.logout();

    // we wait just a bit for the logout to complete to avoid the login screen thinking we're still logged in
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

}
