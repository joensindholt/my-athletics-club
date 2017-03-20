import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Member, MemberService } from '../../../services/member.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  members: Member[];

  constructor(
    private router: Router,
    private memberService: MemberService
  ) { }

  ngOnInit() {
    this.memberService.getMembers()
      .subscribe(members => this.members = members);
  }

  addMember() {
    this.router.navigate(['/admin/members/add']);
  }
}
