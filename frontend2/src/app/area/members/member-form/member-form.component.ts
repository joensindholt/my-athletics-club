import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Member } from './../../../services/member.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {

  @Input() member: Member;
  @Input() submitButtonText: string;

  @Output() formSubmitted: EventEmitter<Member> = new EventEmitter<Member>();

  memberData: any;

  constructor() { }

  ngOnInit() {
    this.memberData = this.mapFromMember(this.member);
  }

  updateAgeClass() {
    if (this.memberData.birthDate) {
      let genderPrefix = this.memberData.gender === 'male' ? 'D' : 'P';
      let birthYear = new Date(this.memberData.birthDate).getFullYear();
      let currentYear = new Date().getFullYear();
      let ageClassYear = currentYear - birthYear;
      this.memberData.ageClass = genderPrefix + ageClassYear;
    } else {
      this.memberData.ageClass = '';
    }
  }

  submit() {
    this.formSubmitted.emit(this.mapToMember(this.memberData));
  }

  mapFromMember(member: Member): any {
    var memberData: any = Object.assign({}, member);

    memberData.addresses = memberData.addresses || [<any>{}];

    if (member.emails && member.emails.length > 0) {
      memberData.emails = [];
      for (let email of member.emails) {
        memberData.emails.push({ value: email });
      }
    } else {
      memberData.emails = [{}];
    }

    if (member.phones && member.phones.length > 0) {
      memberData.phones = [];
      for (let phone of member.phones) {
        memberData.phones.push({ value: phone });
      }
    } else {
      memberData.phones = [{}];
    }

    return memberData;
  }

  mapToMember(data: any): Member {
    var member = <Member>Object.assign({}, data);

    if (data.emails && data.emails.length > 0) {
      member.emails = [];
      for (let email of data.emails) {
        if (email.value !== undefined && email.value.trim() !== '') {
          member.emails.push(email.value);
        }
      }
    }

    if (data.phones && data.phones.length > 0) {
      member.phones = [];
      for (let phone of data.phones) {
        if (phone.value !== undefined && phone.value.trim() !== '') {
          member.phones.push(phone.value);
        }
      }
    }

    return member;
  }

  addAddress() {
    this.member.addresses.push(<any>{});
  }

  addEmail() {
    this.member.emails.push(<any>{});
  }

  addPhone() {
    this.member.phones.push(<any>{});
  }
}
