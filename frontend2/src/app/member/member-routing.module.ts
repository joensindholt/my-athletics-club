import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../core/auth-guard.service';
import { MemberComponent } from './member.component';
import { MemberDetailsComponent } from "./member-details/member-details.component";

const routes = [
  { path: 'members', component: MemberComponent, canActivate: [AuthGuardService], canActivateChild: [AuthGuardService] },
  { path: 'members/:id', component: MemberDetailsComponent, canActivate: [AuthGuardService], canActivateChild: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
