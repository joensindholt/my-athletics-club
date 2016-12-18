import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MembersComponent } from './members.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'members', component: MembersComponent }
    ])
  ],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
