import { Component } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { DynamicFormField } from "../dynamic-form-field";

@Component({
  selector: 'app-form-button',
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.scss'],
  host: {
    'class': 'col-sm-12 mt-3'
  }
})
export class FormButtonComponent {

  config: DynamicFormField;
  group: FormGroup;

}
