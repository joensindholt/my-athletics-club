import { Component } from '@angular/core';
import { MemberService } from './services/member.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MemberService]
})
export class AppComponent {
  title = 'app works!';
}
