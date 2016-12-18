import { Component, OnInit } from '@angular/core';
import { MemberService } from '../shared/index';

/**
 * This class represents the lazy loaded MembersComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-members',
  templateUrl: 'members.component.html',
  styleUrls: ['members.component.css'],
})
export class MembersComponent implements OnInit {

  errorMessage: string;
  members: any[] = [];

  /**
   * Creates an instance of the MembersComponent with the injected
   * MembersService.
   *
   * @param {MembersService} MembersService - The injected MembersService.
   */
  constructor(public memberService: MemberService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getMembers();
  }

  /**
   * Handle the nameListService observable
   */
  getMembers() {
    this.memberService.get()
      .subscribe(
        members => this.members = members,
        error => this.errorMessage = <any>error
      );
  }
}
