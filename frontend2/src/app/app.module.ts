import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MembersComponent } from './area/members/members/members.component';
import { EventsComponent } from './area/events/events/events.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './area/login/login/login.component';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './services/index';
import { AdminComponent } from './area/admin/admin.component';
import { AdminRoutingModule } from './area/admin/admin-routing.module';
import { AddMemberButtonComponent } from './area/members/add-member-button/add-member-button.component';
import { AddMemberComponent } from './area/members/add-member/add-member.component';
import { EditMemberComponent } from './area/members/edit-member/edit-member.component';
import { MaterialModule } from '@angular/material';
import { Md2DatepickerModule }  from 'md2-datepicker';
import { MemberFormComponent } from './area/members/member-form/member-form.component';
import { ApiService } from './services/api.service';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent },
  { path: '',
    redirectTo: '/admin/members',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    MembersComponent,
    EventsComponent,
    PageNotFoundComponent,
    SidebarComponent,
    LoginComponent,
    AdminComponent,
    AddMemberButtonComponent,
    AddMemberComponent,
    EditMemberComponent,
    MemberFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AdminRoutingModule,
    MaterialModule,
    Md2DatepickerModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuard,
    ApiService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
