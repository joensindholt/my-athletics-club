import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members.component';
import { MemberEditComponent } from './member-edit.component';
import { MembersRoutingModule } from './members-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MemberService } from '../shared/members/index';

@NgModule({
  imports: [CommonModule, MembersRoutingModule, SharedModule],
  declarations: [MembersComponent, MemberEditComponent],
  exports: [MembersComponent, MemberEditComponent],
  providers: [MemberService]
})
export class MembersModule { }
