import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventListComponent } from './event-list/event-list.component';

@NgModule({
  imports: [
    SharedModule,
    EventRoutingModule
  ],
  declarations: [
    EventComponent,
    EventDetailsComponent,
    EventListComponent
  ],
  providers: [
  ]
})
export class EventModule { }
