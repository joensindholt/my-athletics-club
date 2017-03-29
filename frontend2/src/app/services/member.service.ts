import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

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
  gender: string; // male or female
  birthDate: string;
  ageClass: string;
  team: string; // minies, middles or elders
}

@Injectable()
export class MemberService {

  constructor(
    private apiService: ApiService
  ) {
  }

  getMembers(): Observable<Member[]> {
    return this.apiService.get('/members').map(json => <Member[]>json.items);
  }

  addMember(member: Member): Observable<Member> {
    return this.apiService.post('/members', member).map(json => <Member>json);
  }

  getMember(slug: string): Observable<Member> {
    return this.apiService.get('/members/' + slug).map(json => <Member>json);
  }

  updateMember(member: Member): Observable<Member> {
    return this.apiService.put('/members/' + member.slug, member).map(json => <Member>json);
  }

  deleteMember(member: Member): Observable<any> {
    return this.apiService.delete('/members/' + member.slug);
  }
}
