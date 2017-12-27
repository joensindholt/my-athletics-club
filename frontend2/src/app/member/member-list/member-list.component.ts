import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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

  @Output() memberSelected: EventEmitter<Member> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private memberService: MemberService
  ) {
  }

  ngOnInit() {
    this.memberService.getMembers().subscribe(members => {
      this.members = members;
      if (this.members.length > 0) {
        this.selectMember(this.members[0]);
      }
    });
  }

  selectMember(member: Member) {
    this.memberSelected.emit(member);
  }

  chargeMemberships() {
    this.apiService.post('/members/charge-all', {}).subscribe(() => {
      // TODO: Notify
    });
  }
}
