import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberService } from './member.service';
import { MemberComponent } from './member.component';

@NgModule({
  imports: [
    SharedModule,
    MemberRoutingModule
  ],
  declarations: [
    MemberComponent
  ],
  providers: [
    MemberService
  ]
})
export class MemberModule { }
