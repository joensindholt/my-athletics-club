import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Member, MemberService } from '../../../services/member.service';

@Component({
  selector: 'edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {

  member: any;
  originalMember: Member;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService
  ) { }

  ngOnInit() {
    let slug = this.route.snapshot.params['slug'];
    this.memberService.getMember(slug)
      .subscribe(member => {
        this.originalMember = member;
      });
  }

  onFormSubmitted(member: Member) {
    console.log('updating member', member);
    this.memberService.updateMember(member)
      .subscribe(() => {
        this.router.navigate(['/admin/members']);
      });
  }
}
