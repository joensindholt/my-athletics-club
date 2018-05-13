import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SubscriptionsComponent } from "./subscriptions/subscriptions.component";
import { SubscriptionService } from "./subscription.service";
import { OutstandingSubscriptionComponent } from "./outstanding-subscriptions/outstanding-subscriptions.component";
import { SubscriptionReminderListComponent } from "./subscription-reminder-list/subscription-reminder-list.component";
import { SubscriptionsRoutingModule } from "./subscription-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [SharedModule, SubscriptionsRoutingModule],
  declarations: [
    SubscriptionsComponent,
    OutstandingSubscriptionComponent,
    SubscriptionReminderListComponent
  ],
  providers: [SubscriptionService]
})
export class SubscriptionModule {}
