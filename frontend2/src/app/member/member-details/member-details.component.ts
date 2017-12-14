import { Component, OnInit, Input } from '@angular/core';
import { Member } from "../member";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

  @Input() member: Member;

  constructor() { }

  ngOnInit() {
  }

}
