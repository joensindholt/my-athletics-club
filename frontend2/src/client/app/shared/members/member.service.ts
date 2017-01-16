import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../config/env.config';
import * as moment from 'moment/moment';

@Injectable()
export class MemberService {

  private headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  get(): Observable<string[]> {
    return this.http.get(Config.API + '/members')
      .map((res: Response) => this.toMembers(res.json()))
      .catch(this.handleError);
  }

  getMember(id: string): Observable<string> {
    return this.http.get(Config.API + '/members/' + id)
      .map((res: Response) => this.toMember(res.json()))
      .catch(this.handleError);
  }

  updateMember(member: any): Observable<string> {
    let url = Config.API + '/members/' + member._id;
    return this.http.put(url, JSON.stringify(member), { headers: this.headers })
      .map((res: Response) => this.toMember(res.json()))
      .catch(this.handleError);
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  private toMembers(json: any): any {
    for (var obj of json) {
      obj = this.toMember(obj);
    }
    return json;
  }

  private toMember(json: any): any {
    var member = json;

    if (member.birthDate) {
      member.birthDate = moment(member.birthDate).format('YYYY-MM-DD');
    }

    return member;
  }
}

