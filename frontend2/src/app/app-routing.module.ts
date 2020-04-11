import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListLayoutComponent } from './event/layouts/event-list-layout/event-list-layout.component';
import { MemberAddLayoutComponent } from './member/layouts/member-add-layout/member-add-layout.component';
import { MemberListLayoutComponent } from './member/layouts/member-list-layout/member-list-layout.component';

const routes: Routes = [
  {
    path: 'members',
    component: MemberListLayoutComponent,
  },
  {
    path: 'members/add',
    component: MemberAddLayoutComponent,
  },
  {
    path: 'events',
    component: EventListLayoutComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'members',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
