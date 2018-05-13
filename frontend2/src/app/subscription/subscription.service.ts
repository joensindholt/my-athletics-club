import { Injectable } from '@angular/core';
import { Subscription } from "./subscription";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ApiService } from "../core/api.service";
import { DateService } from "../core/date.service";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class SubscriptionService {

  private subscriptionsLoaded: boolean = false;
  private subscriptions$ = new BehaviorSubject<Subscription[]>([]);

  constructor(
    private apiService: ApiService,
    private dateService: DateService
  ) {
  }

  getSubscriptions(): BehaviorSubject<Subscription[]> {
    if (!this.subscriptionsLoaded) {
      this.subscriptionsLoaded = true;
      this.apiService.get('/subscriptions').subscribe((subscriptions: Subscription[]) => this.setSubscriptions(subscriptions));
    }

    return this.subscriptions$;
  }

  sendReminders(): Observable<any> {
    return this.apiService.post('/subscriptions/reminders', {})
      // sending reminders alters the state of possibly all subscriptions so we reload them all
      // before returning the observable result
      .map((subscriptions: Subscription[]) => {
        this.setSubscriptions(subscriptions)
        return subscriptions;
      });
  }

  private setSubscriptions(subscriptions: Subscription[]) {
    this.subscriptions$.next(subscriptions.map(s => {
      s.latestInvoiceDate = this.dateService.apiDateToString(s.latestInvoiceDate);
      return s;
    }));
  }
}
