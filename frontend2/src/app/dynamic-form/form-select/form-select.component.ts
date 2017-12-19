import { Component, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss']
})
export class FormSelectComponent {

  @Input()
  field: string;

  @Input()
  label: string;

  @Input()
  placeholder?: string;

  @Input()
  options: any[];

  @Input()
  validations: any[];

  @Input()
  formGroup: FormGroup;
}
