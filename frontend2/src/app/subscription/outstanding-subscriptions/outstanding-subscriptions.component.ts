import { Component, OnInit } from "@angular/core";
import { Subscription } from "../subscription";
import { SubscriptionService } from "../subscription.service";

@Component({
  selector: "app-outstanding-subscriptions",
  templateUrl: "./outstanding-subscriptions.component.html",
  styleUrls: ["./outstanding-subscriptions.component.scss"]
})
export class OutstandingSubscriptionComponent implements OnInit {
  subscriptions: Subscription[];

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit() {
    this.subscriptionService
      .getSubscriptions()
      .subscribe(
        subscriptions =>
          (this.subscriptions = subscriptions.filter(s => s.balance < 0))
      );
  }
}
