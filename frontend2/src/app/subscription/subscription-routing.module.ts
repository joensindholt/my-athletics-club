import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AuthGuardService } from "../core/auth-guard.service";
import { SubscriptionsComponent } from "./subscriptions/subscriptions.component";

const routes = [
  {
    path: "subscriptions",
    component: SubscriptionsComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule {}
