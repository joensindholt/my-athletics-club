import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from "@angular/router";

import { ApiService } from "../../core/api.service";
import { Member } from "../member";
import { MemberService } from "../member.service";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  members: Member[];
  memberFilter: any = { name: '' };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private memberService: MemberService
  ) {
  }

  ngOnInit() {
    this.memberService.getMembers().subscribe(members => {
      this.members = members;
    });
  }

  selectMember(member: Member) {
    this.router.navigate(['members', member.id]);
  }

  chargeMemberships() {
    this.apiService.post('/members/charge-all', {}).subscribe(() => {
      // TODO: Notify
    });
  }
}
