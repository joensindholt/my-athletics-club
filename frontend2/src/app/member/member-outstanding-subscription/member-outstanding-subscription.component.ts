import { Component, OnInit } from '@angular/core';
import { Member } from "../member";
import { MemberService } from "../member.service";
import { Subscription } from "../subscription";
import { SubscriptionService } from "../subscription.service";

@Component({
  selector: 'app-member-outstanding-subscription',
  templateUrl: './member-outstanding-subscription.component.html',
  styleUrls: ['./member-outstanding-subscription.component.scss']
})
export class MemberOutstandingSubscriptionComponent implements OnInit {

  subscriptions: Subscription[];

  constructor(
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit() {
    this.subscriptionService.getSubscriptions().subscribe(subscriptions =>
      this.subscriptions = subscriptions.filter(s => s.balance < 0));
  }

}
