import { Component, OnInit } from '@angular/core';
import { MemberService } from '../shared/index';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'sd-members',
  templateUrl: 'members.component.html',
  styleUrls: ['members.component.css'],
})
export class MembersComponent implements OnInit {

  errorMessage: string;
  members: any[] = [];

  constructor(
    private memberService: MemberService,
    private router: Router) {

  }

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    this.memberService.get()
      .subscribe(
        members => this.members = members,
        error => this.errorMessage = <any>error
      );
  }

  editMember(_id: string) {
    this.router.navigate(['/members/edit', _id]);
  }
}
