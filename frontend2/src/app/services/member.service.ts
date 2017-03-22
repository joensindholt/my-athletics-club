import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

export enum Gender { "male", "female" }

export enum Team { "mini", "middle", "elders" }

export class Member {
    id: number;
    slug: string;
    name: string;
    addresses: [{
      line1: string,
      postalCode: string,
      city: string
    }];
    emails: string[];
    phones: string[];
    gender: Gender;
    birthDate: string;
    ageClass: string;
    team: Team;
}

@Injectable()
export class MemberService {

  private headers = new Headers({'Content-Type': 'application/json'});

  private url = 'http://localhost:5000/api/members';

  members: Member[] = [
    <any>{ id: 1, slug: 'joensindholt', name: 'Joen Sindholt', addresses: [{}], emails: ['joensindholt@gmail.com', 'joensindholt@unity3d.com'], phones: ['+45 51804599'] },
    <any>{ id: 2, slug: 'glenniesindholt', name: 'Glennie Sindholt', addresses: [<any>{}] }
  ];

  constructor(
    private http: Http
  ) {

  }

  getMembers(): Observable<Member[]> {
    return Observable.of(this.members);
  }

  getMember(slug: string): Observable<Member> {
    return Observable.of(this.members.find(m => m.slug === slug));
  }

  updateMember(member: Member): Observable<Response> {
    const url = `${this.url}/${member.id}`;
    return this.http.put(url, JSON.stringify(member), {headers: this.headers});
  }
}
