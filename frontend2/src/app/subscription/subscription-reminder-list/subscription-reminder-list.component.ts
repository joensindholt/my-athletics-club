import { Component, OnInit } from '@angular/core';
import { Subscription } from "../subscription";
import { SubscriptionService } from "../subscription.service";
import { NotificationService } from "../../core/notification.service";

@Component({
  selector: 'app-subscription-reminder-list',
  templateUrl: './subscription-reminder-list.component.html',
  styleUrls: ['./subscription-reminder-list.component.scss']
})
export class SubscriptionReminderListComponent implements OnInit {

  subscriptions: Subscription[];
  sendRemindersButtonText: string = 'Send Rykkere';

  constructor(
    private subscriptionService: SubscriptionService,
    private notificationsService: NotificationService
  ) { }

  ngOnInit() {
    this.subscriptionService.getSubscriptions().subscribe(subscriptions => {
      this.subscriptions = subscriptions.filter(s => s.reminder);
    });
  }

  sendReminders() {
    this.sendRemindersButtonText = 'Sender...';
    this.subscriptionService.sendReminders().subscribe(() => {
      this.sendRemindersButtonText = 'Send Rykkere';
      this.notificationsService.success("Rykkerne er sendt");
    });
  }
}
