import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from "../../core/api.service";
import { Member } from "../member";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  members: Member[];
  memberFilter: Member = { name: '' };

  @Output() memberSelected: EventEmitter<Member> = new EventEmitter();

  constructor(
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.apiService.get('/members').subscribe(memberData => this.members = memberData.items);
  }

  selectMember(member: Member) {
    this.memberSelected.emit(member);
  }
}
