import { Injectable } from '@angular/core';
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

  members: Member[] = [
    <any>{ id: 1, slug: 'joensindholt', name: 'Joen Sindholt', addresses: [{}], emails: ['joensindholt@gmail.com', 'joensindholt@unity3d.com'], phones: ['+45 51804599'] },
    <any>{ id: 2, slug: 'glenniesindholt', name: 'Glennie Sindholt', addresses: [<any>{}] }
  ];

  constructor() { }

  getMembers(): Observable<Member[]> {
    return Observable.of(this.members);
  }

  getMember(slug: string): Observable<Member> {
    return Observable.of(this.members.find(m => m.slug === slug));
  }

  updateMember(member: Member): Observable<void> {
    var index = this.members.findIndex(m => m.id == member.id);
    this.members[index] = member;
    return Observable.of(null);
  }
}
