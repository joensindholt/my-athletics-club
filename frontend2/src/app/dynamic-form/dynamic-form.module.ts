import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormInputComponent } from './form-input/form-input.component';
import { FormSelectComponent } from './form-select/form-select.component';
import { FormButtonComponent } from './form-button/form-button.component';
import { DynamicFieldDirective } from './dynamic-field.directive';
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
    DynamicFormComponent,
    FormInputComponent,
    FormSelectComponent,
    FormButtonComponent,
    DynamicFieldDirective,
    FormDateComponent
  ],
  exports: [
    DynamicFormComponent
  ],
  entryComponents: [
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormDateComponent
  ]
})
export class DynamicFormModule {}
