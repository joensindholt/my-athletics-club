import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { AwesomePipe } from './awesome.pipe';
import { DynamicFormModule } from "../dynamic-form/dynamic-form.module";

@NgModule({
  imports: [
    CommonModule,
    FilterPipeModule,
    DynamicFormModule
  ],
  declarations: [
    AwesomePipe
  ],
  exports: [
    AwesomePipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilterPipeModule,
    DynamicFormModule]
})
export class SharedModule { }
