import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Member } from "./member";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  selectedMember: BehaviorSubject<Member>;

  constructor() { }

  ngOnInit() {
    this.selectedMember = new BehaviorSubject<Member>(null);
  }

  onMemberSelected(member: Member) {
    this.selectedMember.next(member);
  }

}
