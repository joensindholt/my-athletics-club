import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  credentials: {
    username: string,
    password: string
  };

  constructor(
    private router: Router,
    private zone: NgZone,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.credentials = {
      username: '',
      password: ''
    };

    this.userService.loggedInUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['']);
      }
    })
  }

  ngAfterViewInit(): void {
    gapi.signin2.render('googleLogin', {
      longtitle: true,
      onsuccess: (googleUser: any) => this.handleSuccess(googleUser),
      onfailure: () => this.handleFailure()
    });
  }

  handleSuccess(googleUser) {
    this.zone.run(() => {
      this.userService.googleLogin(googleUser.getAuthResponse().id_token);
    });
  }

  handleFailure() {
    this.zone.run(() => {
      console.log('failure');
    });
  }


  login($event) {
    $event.preventDefault();
    this.userService.login(this.credentials.username, this.credentials.password);
  }

  onGoogleSignInSuccess($event) {
    let id_token = $event.googleUser.getAuthResponse().id_token;
    this.userService.googleLogin(id_token);
  }
}
