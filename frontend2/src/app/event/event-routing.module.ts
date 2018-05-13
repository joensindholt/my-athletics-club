import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { EventComponent } from "./event.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { AuthGuardService } from "../core/auth-guard.service";

/* The event module is lazy loaded so the path should be empty.
   The app routing module defines the subpath this module is loaded under */
const routes = [
  {
    path: "",
    component: EventComponent,
    canActivate: [AuthGuardService],
    children: [{ path: ":id", component: EventDetailsComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {}
