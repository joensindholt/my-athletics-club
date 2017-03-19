import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './../../auth.guard';
import { AdminComponent } from './admin.component';
import { MembersComponent } from './../members/members/members.component';
import { EditMemberComponent } from './../members/edit-member/edit-member.component';
import { AddMemberComponent } from './../members/add-member/add-member.component';
import { EventsComponent } from './../events/events/events.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MembersComponent },
      { path: 'members/add', component: AddMemberComponent },
      { path: 'members/:slug', component: EditMemberComponent },
      { path: 'events', component: EventsComponent },
      {
        path: '',
        redirectTo: 'members',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
