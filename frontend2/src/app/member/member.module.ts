import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberService } from './member.service';
import { MemberComponent } from './member.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberDetailsComponent } from './member-details/member-details.component';

@NgModule({
  imports: [
    SharedModule,
    MemberRoutingModule
  ],
  declarations: [
    MemberComponent,
    MemberListComponent,
    MemberDetailsComponent
  ],
  providers: [
    MemberService
  ]
})
export class MemberModule { }
