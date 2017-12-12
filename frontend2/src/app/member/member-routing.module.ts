import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MemberComponent } from './member.component';
import { AuthGuardService } from '../core/auth-guard.service';

const routes = [
  {
    path: 'member',
    component: MemberComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
    // ,
    // children: [
    //   { path: ':id', component: MemberDetailsComponent }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
