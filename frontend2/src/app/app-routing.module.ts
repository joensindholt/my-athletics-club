import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventListLayoutComponent } from "./event/layouts/event-list-layout/event-list-layout.component";
import { MemberListLayoutComponent } from "./member/layouts/member-list-layout/member-list-layout.component";

const routes: Routes = [
  {
    path: "",
    component: MemberListLayoutComponent
  },
  {
    path: "events",
    component: EventListLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
