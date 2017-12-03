import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  private events: Array<any>;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.apiService.get('/events').subscribe(events => this.events = events);
  }

}
