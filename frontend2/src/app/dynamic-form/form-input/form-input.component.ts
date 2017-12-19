import { Component, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent {

  @Input()
  field: string;

  @Input()
  label?: string;

  @Input()
  placeholder?: string;

  @Input()
  validations: any[];

  @Input()
  formGroup: FormGroup;

  @Input()
  inputClass: string;
}
