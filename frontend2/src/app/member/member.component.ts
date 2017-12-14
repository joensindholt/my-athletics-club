import { Component, OnInit } from '@angular/core';
import { Member } from "./member";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  selectedMember: Member;

  constructor() { }

  ngOnInit() {
  }

  onMemberSelected(member: Member) {
    this.selectedMember = member;
  }

}
