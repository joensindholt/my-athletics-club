import { Component, ElementRef, AfterViewInit, ViewChild, NgZone, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";

import * as $ from 'jquery';
import '@fengyuanchen/datepicker';

@Component({
  selector: 'app-form-date',
  templateUrl: './form-date.component.html',
  styleUrls: ['./form-date.component.scss']
})
export class FormDateComponent implements AfterViewInit {

  @ViewChild('datepicker') datepicker: ElementRef;

  @Input()
  field: string;

  @Input()
  label: string;

  @Input()
  placeholder?: string;

  @Input()
  validations: any[];

  @Input()
  formGroup: FormGroup;

  constructor(
    private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    const datepicker = $(this.datepicker.nativeElement).datepicker({
      autoHide: true,
      format: 'dd-mm-yyyy'
    });

    datepicker.on('pick.datepicker', e => {
      this.formGroup.get(this.field).setValue(datepicker.datepicker('getDate', true));
    })
  }
}
