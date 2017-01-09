import { Component, OnInit } from '@angular/core';
import { MemberService } from '../shared/index';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'sd-member-edit',
  templateUrl: 'member-edit.component.html',
  styleUrls: ['member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {

  errorMessage: string;
  member: any;

  constructor(
    private memberService: MemberService, 
    private route: ActivatedRoute) {
    }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.memberService.getMember(params['id']))
      .subscribe(member => this.member = member);
  }

  onSubmit() {
    this.memberService.updateMember(this.member)
      .subscribe(member => {});
  }
}
