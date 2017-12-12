import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { ApiService } from './api.service';
import { Subject } from 'rxjs/Subject';
import { User } from './user';

@Injectable()
export class UserService {

  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public loggedInUser$ = new BehaviorSubject<User>(null);

  private googleAuth: any;

  constructor(
    private apiService: ApiService
  ) {
    this.init();

    gapi.load('auth2', () => {
      this.googleAuth = gapi.auth2.init({
        client_id: '90031089579-ejh2po3lssvusiea848mr2h1ksg2648c.apps.googleusercontent.com'
      });

      console.log('this.googleAuth', this.googleAuth);
    });
  }

  init() {
    let userJson = localStorage.getItem('user');

    if (!userJson || userJson === 'null') {
      console.info('no user found in local storage');
      return;
    }

    let user: User = JSON.parse(userJson);

    if (user.expires * 1000 <= (new Date()).valueOf()) {
      console.info('access token expired', user.expires * 1000, new Date().valueOf());
      return;
    }

    this.loggedInUser$.next(user);
    this.isLoggedIn$.next(true);
}

  login(username: string, password: string) {
    this.apiService
      .post('/login', { organizationId: 'gik', username, password })
      .subscribe((user: User) => {
        this.handleSuccessfullLogin(user);
      }, err => {
        console.log(err);
      });
  }

  googleLogin(id_token: string) {
    this.apiService
      .post('/login-google', { idToken: id_token })
      .subscribe((user: User) => {
        this.handleSuccessfullLogin(user);
      }, err => {
        console.log(err);
      })
  }

  handleSuccessfullLogin(user: User) {
    this.isLoggedIn$.next(true);
    this.loggedInUser$.next(user);
    localStorage.setItem('user', JSON.stringify(user));
}

  logout() {
    this.googleAuth.disconnect();
    this.isLoggedIn$.next(false);
    this.loggedInUser$.next(null);
    localStorage.setItem('user', '');
  }
}
