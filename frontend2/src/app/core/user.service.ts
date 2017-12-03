import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';

@Injectable()
export class UserService {

  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.isLoggedIn$.next(false);
  }

  login(): Observable<boolean> {
    this.isLoggedIn$.next(true);
    console.log('dummy login done');

    return of(true);
  }
}
