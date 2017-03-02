import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.css'],
    providers: [MemberService]
})
export class MembersComponent implements OnInit {

    members: any;
    editingMember: any;
    isAddingMember: boolean;

    constructor(private memberService: MemberService) { }

    ngOnInit() {
        this.memberService.getMembers().then(members => this.members = members);
        this.isAddingMember = false;
    }

    addMember() {
        this.editingMember = null;
        this.isAddingMember = true;
    }

    editMember(member) {
        this.isAddingMember = false;
        this.editingMember = member;
    }
}
