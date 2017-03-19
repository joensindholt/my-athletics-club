import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Member, MemberService } from '../../../services/member.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  members: Member[];

  constructor(
    private memberService: MemberService,
    private router: Router
  ) { }

  ngOnInit() {
    this.memberService.getMembers().then(members => this.members = members);
  }

  addMember() {
    this.router.navigate(['/admin/members/add']);
  }
}
