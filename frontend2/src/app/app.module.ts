import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { ApiService } from './core/api.service';
import { AuthGuardService } from './core/auth-guard.service';
import { UserService } from './core/user.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    ApiService
  ]
})
export class AppModule { }
