import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

export interface Notification {
  type: 'success' | 'error',
  text: string
}

@Injectable()
export class NotificationService {

  notifications$ = new Subject<Notification>();

  constructor() { }

  success(text: string) {
    this.notifications$.next({ type: 'success', text });
  }

  error(text: string) {
    this.notifications$.next({ type: 'error', text });
  }
}
