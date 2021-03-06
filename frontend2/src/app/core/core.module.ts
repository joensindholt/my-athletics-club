import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccessTokenService } from './access-token.service';
import { DateService } from "./date.service";
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from "./notification.service";

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NavbarComponent,
    LoginComponent,
    NotificationComponent
  ],
  exports: [
    NavbarComponent,
    NotificationComponent
  ],
  providers: [
    ApiService,
    UserService,
    AuthGuardService,
    AccessTokenService,
    DateService,
    NotificationService
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: []
    };
  }
}
