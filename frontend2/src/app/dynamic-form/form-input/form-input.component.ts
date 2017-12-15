import { Component } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { DynamicFormField } from "../dynamic-form-field";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  host: {
    '[class]': "config.width === 'half' ? 'col-sm-6' : 'col-sm-12'"
  }
})
export class FormInputComponent {

  config: DynamicFormField;
  group: FormGroup;

}
