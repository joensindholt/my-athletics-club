import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberModule } from './member/member.module';
import { AuthGuardService } from './core/auth-guard.service';
import { LoginComponent } from './core/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'member', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'event', loadChildren: 'app/lazy-modules/event/event.module#EventModule' },
];

@NgModule({
  imports: [
    MemberModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
