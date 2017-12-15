import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { DynamicFormField } from "../dynamic-form-field";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnChanges {

  @Input()
  config: DynamicFormField[] = [];

  form: FormGroup;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.form = this.createGroup();
    }
  }

  createGroup(): FormGroup {
    const group = this.formBuilder.group({});
    this.config.forEach(control => group.addControl(control.name, this.formBuilder.control(control.value, control.validators)));
    return group;
  }
}
