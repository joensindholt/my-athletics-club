import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MembersComponent } from './members.component';
import { MemberEditComponent } from './member-edit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'members', component: MembersComponent },
      { path: 'members/edit/:id', component: MemberEditComponent}
    ])
  ],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
