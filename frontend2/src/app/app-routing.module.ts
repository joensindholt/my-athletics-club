import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MemberModule } from "./member/member.module";
import { AuthGuardService } from "./core/auth-guard.service";
import { LoginComponent } from "./core/login/login.component";
import { SubscriptionModule } from "./subscription/subscription.module";

const routes: Routes = [
  { path: "", redirectTo: "subscriptions", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "events", loadChildren: "app/event/event.module#EventModule" },
  { path: "members", loadChildren: "app/member/member.module#MemberModule" }
];

@NgModule({
  imports: [SubscriptionModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
