import { Component, OnInit, Input } from '@angular/core';
import { Member } from "../member";

@Component({
  selector: 'app-register-payment',
  templateUrl: './register-payment.component.html',
  styleUrls: ['./register-payment.component.scss']
})
export class RegisterPaymentComponent implements OnInit {

  @Input()
  member: Member;

  constructor() { }

  ngOnInit() {
  }

}
