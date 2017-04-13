import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Member, MemberService } from '../../../services/member.service';

@Component({
  selector: 'add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {

  member: Member;

  constructor(
    private router: Router,
    private memberService: MemberService
  ) { }

  ngOnInit() {
    this.member = <Member>{};
  }

  onFormSubmitted(member: Member) {
    this.memberService.addMember(member)
      .subscribe(() => {
        this.router.navigate(['/admin/members']);
      });
  }
}
