import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {

  @Input()
  member: any;

  constructor() { }

  ngOnInit() {
  }

  save() {
    console.log('saving', this.member);
  }
}
