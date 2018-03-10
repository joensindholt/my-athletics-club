import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as moment from 'moment';
import { Member } from "../member";
import { ApiService } from "../../core/api.service";
import { DateService } from "../../core/date.service";
import { NotificationService } from "../../core/notification.service";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnChanges {

  @Input()
  member: Member;

  form: FormGroup;
  terminationForm: FormGroup;
  memberTerminateActive: boolean;
  submitMemberButtonText: string = 'Gem';

  constructor(
    private apiService: ApiService,
    private dateService: DateService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['member']) {
      this.form = this.fb.group({
        name: [this.member ? this.member.name : null, Validators.required],
        gender: [this.member ? this.member.gender : null, Validators.required],
        team: [this.member ? this.member.team : null, Validators.required],
        email: [this.member ? this.member.email : null, Validators.compose([Validators.required, Validators.email])],
        email2: [this.member ? this.member.email2 : null, (control) => !control.value ? null : Validators.email(control)],
        birthDate: [this.member ? this.dateService.apiDateToString(this.member.birthDate) : null, Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)],
        familyMembershipNumber: [this.member ? this.member.familyMembershipNumber : null, Validators.pattern(/^\d*$/)],
        startDate: [this.member ? this.dateService.apiDateToString(this.member.startDate) : null, Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)]
      });

      this.terminationForm = this.fb.group({
        terminationDate: [moment().format('DD-MM-YYYY'), Validators.compose([Validators.required, Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)])]
      })
    }
  }

  formSubmitted(form: FormGroup) {
    this.submitMemberButtonText = 'Gemmer...';

    var memberData = form.value;

    this.member.name = memberData.name;
    this.member.gender = memberData.gender;
    this.member.team = memberData.team;
    this.member.email = memberData.email;
    this.member.email2 = memberData.email2;
    this.member.birthDate = this.dateService.clientDateToApiDate(memberData.birthDate);
    this.member.familyMembershipNumber = memberData.familyMembershipNumber;
    this.member.startDate = this.dateService.clientDateToApiDate(memberData.startDate);

    this.apiService.put(`/members/${this.member.id}`, this.member).subscribe(() => {
      this.submitMemberButtonText = 'Gem';
      this.notificationService.success('Medlemmet er opdateret');
    });
  }

  initiateTerminateMember(): void {
    this.memberTerminateActive = true;
  }

  cancelTerminateMember(): void {
    this.memberTerminateActive = false;
  }

  teminationSubmitted(terminationForm): void {
    var data = {
      memberId: this.member.id,
      terminationDate: this.dateService.clientDateToApiDate(terminationForm.terminationDate)
    };

    this.apiService.post('/members/terminate', data).subscribe(() => this.notificationService.success('Medlemmet er udmeldt'));
  }

  findAvailableFamilyMembershipNumber(): void {
    this.apiService.get('/members/available-family-membership-number')
      .subscribe(data => this.form.get('familyMembershipNumber').setValue(data.number));
  }
}
