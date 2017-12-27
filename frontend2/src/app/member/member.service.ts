import { Injectable } from '@angular/core';
import { ApiService } from "../core/api.service";
import { Member } from "./member";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class MemberService {

  private membersLoaded: boolean = false;
  private members$ = new BehaviorSubject<Member[]>([]);

  constructor(
    private apiService: ApiService
  ) {
  }

  getMembers(): BehaviorSubject<Member[]> {
    if (!this.membersLoaded) {
      this.membersLoaded = true;
      this.apiService.get('/members').subscribe(data => {
        this.members$.next(data.items);
      });
    }

    return this.members$;
  }

}
