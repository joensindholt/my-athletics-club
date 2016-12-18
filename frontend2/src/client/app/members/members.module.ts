import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members.component';
import { MembersRoutingModule } from './members-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MemberService } from '../shared/members/index';

@NgModule({
  imports: [CommonModule, MembersRoutingModule, SharedModule],
  declarations: [MembersComponent],
  exports: [MembersComponent],
  providers: [MemberService]
})
export class MembersModule { }
