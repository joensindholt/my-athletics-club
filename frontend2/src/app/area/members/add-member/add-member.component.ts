import { Component, OnInit } from '@angular/core';
import { Member, MemberService } from '../../../services/member.service';

@Component({
  selector: 'add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {

  member: Member;

  constructor(private memberService: MemberService) { }

  ngOnInit() {
    this.member = <Member>{};
  }

  add() {

  }
}
