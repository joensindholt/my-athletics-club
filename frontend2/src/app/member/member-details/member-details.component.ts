import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Member } from "../member";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DynamicFormField } from "../../dynamic-form/dynamic-form-field";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnChanges {

  @Input()
  member: Member;

  config: DynamicFormField[];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['member']) {
      this.config = [
        {
          type: 'select',
          label: 'Køn',
          name: 'gender',
          placeholder: 'Vælg køn',
          value: this.member ? this.member.gender : '',
          width: 'half',
          options: [
            { value: 1, text: 'Pige' },
            { value: 2, text: 'Dreng' }
          ],
          validators: [
            Validators.required
          ],
          errorMessages: {
            'required': 'Vælg køn'
          }
        },
        {
          type: 'select',
          label: 'Hold',
          name: 'team',
          placeholder: 'Vælg et hold',
          value: this.member ? this.member.team : '',
          width: 'half',
          options: [
            { value: 1, text: 'Minierne' },
            { value: 2, text: 'Mellemholdet' },
            { value: 3, text: 'Storeholdet' }
          ],
          validators: [
            Validators.required
          ],
          errorMessages: {
            'required': 'Vælg et hold'
          }
        },
        {
          type: 'input',
          label: 'E-mail',
          name: 'email',
          placeholder: 'Indtast en e-mail adresse',
          value: this.member ? this.member.email : '',
          width: 'full',
          validators: [
            Validators.required,
            Validators.email
          ],
          errorMessages: {
            'required': 'Indtast en e-mail adresse',
            'email': 'Indtast venligst en gyldig e-mail adresse'
          }
        },
        {
          type: 'input',
          label: 'E-mail 2',
          name: 'email2',
          placeholder: '',
          value: this.member ? this.member.email2 : '',
          width: 'full',
          validators: [
            (control) => !control.value ? null : Validators.email(control)
          ],
          errorMessages: {
            'email': 'Indtast venligst en gyldig e-mail adresse'
          }
        },
        {
          type: 'date',
          label: 'Fødselsdato',
          name: 'birthDate',
          value: this.member ? this.member.birthDate : null,
          width: 'half',
          validators: [
            Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)
          ],
          errorMessages: {
            'pattern': 'Indtast venligst en gyldig dato'
          }
        },
        {
          type: 'input',
          label: 'Familiemedlemskab',
          name: 'familyMembershipNumber',
          placeholder: '',
          value: this.member ? this.member.familyMembershipNumber : '',
          width: 'half',
          validators: [
            Validators.pattern(/^\d*$/)
          ],
          errorMessages: {
            'pattern': 'Familiemedlemskabsnummeret må kun bestå af tal'
          }
        },
        {
          label: 'Gem',
          name: 'submit',
          type: 'button'
        }
      ];
    }
  }

  formSubmitted($event) {
    console.debug('form submitted', $event);
  }

}
