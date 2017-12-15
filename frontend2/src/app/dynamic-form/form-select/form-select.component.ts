import { Component } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { DynamicFormField } from "../dynamic-form-field";

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss'],
  host: {
    '[class]': "config.width === 'half' ? 'col-sm-6' : 'col-sm-12'"
  }
})
export class FormSelectComponent {

  config: DynamicFormField;
  group: FormGroup;

}
