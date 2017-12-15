import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FormButtonComponent } from "./form-button/form-button.component";
import { FormInputComponent } from "./form-input/form-input.component";
import { FormSelectComponent } from "./form-select/form-select.component";
import { DynamicFormField } from "./dynamic-form-field";
import { FormDateComponent } from "./form-date/form-date.component";

const components = {
  button: FormButtonComponent,
  input: FormInputComponent,
  select: FormSelectComponent,
  date: FormDateComponent
};

@Directive({
  selector: '[appDynamicField]'
})
export class DynamicFieldDirective implements OnInit {

  @Input()
  config: DynamicFormField;

  @Input()
  group: FormGroup;

  component;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit(): void {
    const component = components[this.config.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }

}
