import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { AwesomePipe } from './awesome.pipe';

@NgModule({
  imports: [
    CommonModule,
    FilterPipeModule
  ],
  declarations: [AwesomePipe],
  exports: [AwesomePipe, CommonModule, FormsModule, ReactiveFormsModule, FilterPipeModule]
})
export class SharedModule { }
