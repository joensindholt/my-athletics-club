import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from "../notification.service";
import { trigger, transition, animate, style } from "@angular/animations";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ height: 0 }),
          animate('400ms cubic-bezier(.5, 0, .5, 1)', style({ height: '50px' }))
        ]),
        transition(':leave', [
          style({ height: '50px' }),
          animate('400ms cubic-bezier(.5, 0, .5, 1)', style({ height: 0 }))
        ])
      ]
    )
  ]
})
export class NotificationComponent implements OnInit {

  notification: Notification;

  constructor(
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notification => {
      // show the new notification
      this.notification = notification;

      // hide it again after some time
      setTimeout(() => {
        this.notification = null;
      }, 5000);
    });
  }

}
