import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { EventListLayoutComponent } from "./layouts/event-list-layout/event-list-layout.component";
import { EventListComponent } from './components/event-list/event-list.component';

@NgModule({
  declarations: [EventListLayoutComponent, EventListComponent],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
export class EventModule {}
