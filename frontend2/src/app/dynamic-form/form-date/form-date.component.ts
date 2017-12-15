import { Component, ElementRef, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { DynamicFormField } from "../dynamic-form-field";

import * as $ from 'jquery';
import '@fengyuanchen/datepicker';

@Component({
  selector: 'app-form-date',
  templateUrl: './form-date.component.html',
  styleUrls: ['./form-date.component.scss'],
  host: {
    '[class]': "config.width === 'half' ? 'col-sm-6' : 'col-sm-12'"
  }
})
export class FormDateComponent implements AfterViewInit {

  @ViewChild('datepicker') datepicker: ElementRef;

  config: DynamicFormField;
  group: FormGroup;


  constructor(
    private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    const datepicker = $(this.datepicker.nativeElement).datepicker({
      autoHide: true,
      format: 'dd-mm-yyyy'
    });

    datepicker.on('pick.datepicker', e => {
      this.group.controls[this.config.name].setValue(datepicker.datepicker('getDate', true));
    })
  }
}
