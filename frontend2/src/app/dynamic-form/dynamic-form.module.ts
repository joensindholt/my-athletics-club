import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from './form-input/form-input.component';
import { FormSelectComponent } from './form-select/form-select.component';
import { SharedModule } from "../shared/shared.module";
import { NgPipesModule } from "ngx-pipes";
import { FormDateComponent } from './form-date/form-date.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgPipesModule
  ],
  declarations: [
    FormInputComponent,
    FormSelectComponent,
    FormDateComponent
  ],
  exports: [
    FormInputComponent,
    FormSelectComponent,
    FormDateComponent
  ]
})
export class DynamicFormModule {}
