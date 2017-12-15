import { AbstractControl, ValidationErrors } from "@angular/forms";

export interface DynamicFormField {
  name: string,
  type: 'input' | 'select' | 'button' | 'date',
  label: string,
  value?: string | number,
  placeholder?: string,
  width?: 'full' | 'half',
  options?: [{ value: string | number, text: string }],
  validators?: any,
  errorMessages?: {}
}
