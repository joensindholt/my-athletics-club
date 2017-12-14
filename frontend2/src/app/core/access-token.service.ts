import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable()
export class AccessTokenService {

  constructor() { }

  storeUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User {
    let userJson = localStorage.getItem('user');

    if (!userJson || userJson === 'null') {
      return null;
    }

    return JSON.parse(userJson);
  }

  getAccessToken(): string {
    var user = this.getUser();

    if (!user) {
      return null;
    }

    return user.access_token;
  }

  clearUser() {
    localStorage.setItem('user', '');
  }
}
