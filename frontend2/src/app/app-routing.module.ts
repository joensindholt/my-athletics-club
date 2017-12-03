import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventModule } from './event/event.module';
import { AuthGuardService } from './core/auth-guard.service';
import { LoginComponent } from './core/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'event', pathMatch: 'full' },
  { path: 'member', loadChildren: 'app/lazy-modules/member/member.module#MemberModule' },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [
    EventModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
