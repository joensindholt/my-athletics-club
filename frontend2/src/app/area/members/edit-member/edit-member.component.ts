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
        this.mapFromMember(member);
      });
  }

  mapFromMember(member: Member): any {
    this.member = Object.assign({}, member);

    this.member.addresses = this.member.addresses || [<any>{}];

    if (member.emails && member.emails.length > 0) {
      this.member.emails = [];
      for (let email of member.emails) {
        this.member.emails.push({ value: email });
      }
    } else {
      this.member.emails = [{}];
    }

    if (member.phones && member.phones.length > 0) {
      this.member.phones = [];
      for (let phone of member.phones) {
        this.member.phones.push({ value: phone });
      }
    } else {
      this.member.phones = [{}];
    }

    console.log('component member', this.member);
  }

  mapToMember(data: any): Member {
    var member = <Member>Object.assign({}, data);

    if (data.emails && data.emails.length > 0) {
      member.emails = [];
      for (let email of data.emails) {
        member.emails.push(email.value);
      }
    }

    if (data.phones && data.phones.length > 0) {
      member.phones = [];
      for (let phone of data.phones) {
        member.phones.push(phone.value);
      }
    }

    return member;
  }

  save() {
    let saveMember = this.mapToMember(this.member);
    console.log('saving', saveMember);
    this.memberService.updateMember(saveMember)
      .subscribe(() => {
        this.router.navigate(['/admin/members']);
      });
  }

  addAddress() {
    this.member.addresses.push(<any>{});
  }

  addEmail() {
    this.member.emails.push(<any>{});
  }

  addPhone() {
    this.member.phones.push(<any>{});
  }
}
