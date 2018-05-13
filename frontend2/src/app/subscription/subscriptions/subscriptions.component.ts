import { Component, OnInit } from "@angular/core";
import { Subscription } from "../subscription";
import { Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { SubscriptionService } from "../subscription.service";

@Component({
  selector: "app-subscriptions",
  templateUrl: "./subscriptions.component.html",
  styleUrls: ["./subscriptions.component.scss"]
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[];
  subscriptionFilter: any = { title: "" };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.subscriptionService.getSubscriptions().subscribe(subscriptions => {
      this.subscriptions = subscriptions;
    });
  }

  selectSubscription(subscription: Subscription) {
    this.router.navigate(["subscriptions", subscription.id]);
  }
}
