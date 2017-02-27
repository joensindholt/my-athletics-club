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

const appRoutes: Routes = [
  { path: 'members', component: MembersComponent },
  { path: 'events', component: EventsComponent },
  { path: '',
    redirectTo: '/members',
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
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
