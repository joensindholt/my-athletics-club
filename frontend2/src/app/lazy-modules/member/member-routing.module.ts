import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MemberComponent } from './member.component';
import { AuthGuardService } from '../../core/auth-guard.service';

/* The member module is lazy loaded so the path should be empty.
   The app routing module defines the subpath this module is loaded under */
const routes = [
  { path: '', component: MemberComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
