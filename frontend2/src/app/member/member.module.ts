import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MemberListLayoutComponent } from "./layouts/member-list-layout/member-list-layout.component";
import { MemberListComponent } from './components/member-list/member-list.component';

@NgModule({
  declarations: [MemberListLayoutComponent, MemberListComponent],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
export class MemberModule {}
