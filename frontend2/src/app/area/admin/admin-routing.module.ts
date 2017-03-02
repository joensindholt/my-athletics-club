import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './../../auth.guard';
import { AdminComponent } from './admin.component';
import { MembersComponent } from './../members/members/members.component';
import { EventsComponent } from './../events/events/events.component';

const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MembersComponent },
            { path: 'events', component: EventsComponent },
            { path: '',
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