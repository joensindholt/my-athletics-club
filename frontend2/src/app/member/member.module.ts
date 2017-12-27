import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberService } from './member.service';
import { MemberComponent } from './member.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberOutstandingSubscriptionComponent } from './member-outstanding-subscription/member-outstanding-subscription.component';
import { SubscriptionReminderListComponent } from './subscription-reminder-list/subscription-reminder-list.component';
import { SubscriptionService } from "./subscription.service";

@NgModule({
  imports: [
    SharedModule,
    MemberRoutingModule
  ],
  declarations: [
    MemberComponent,
    MemberListComponent,
    MemberDetailsComponent,
    MemberOutstandingSubscriptionComponent,
    SubscriptionReminderListComponent
  ],
  providers: [
    MemberService,
    SubscriptionService
  ]
})
export class MemberModule { }
