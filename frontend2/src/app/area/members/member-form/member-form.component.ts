import { Component, OnInit, Input } from '@angular/core';

import { Member } from './../../../services/member.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {

  @Input() member: Member;

  constructor() { }

  ngOnInit() {
  }

  updateAgeClass() {
    if (this.member.birthDate) {
      let genderPrefix = this.member.gender === 'male' ? 'D' : 'P';
      let birthYear = new Date(this.member.birthDate).getFullYear();
      let currentYear = new Date().getFullYear();
      let ageClassYear = currentYear - birthYear;
      this.member.ageClass = genderPrefix + ageClassYear;
    } else {
      this.member.ageClass = '';
    }
  }

}
