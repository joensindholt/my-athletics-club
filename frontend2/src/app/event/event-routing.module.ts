import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventComponent } from './event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { AuthGuardService } from '../core/auth-guard.service';

const routes = [
  {
    path: 'event',
    component: EventComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      { path: ':id', component: EventDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
