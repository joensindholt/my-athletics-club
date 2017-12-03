import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private credentials: {
    username: string,
    password: string
  };

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  login($event) {
    $event.preventDefault();

    this.userService.login().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        console.log('return', isLoggedIn);
        this.router.navigate(['/event']);
      } else {
        alert('We could not log you in');
      }
    })
  }
}
