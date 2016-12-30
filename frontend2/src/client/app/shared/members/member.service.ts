import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MemberService {

  constructor(private http: Http) {}

  get(): Observable<string[]> {
    return this.http.get('/assets/members.json')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  getMember(id: string): Observable<string> {
    return new Observable<string>((observer: any) => {
      this.get().subscribe(
        value => {
          var member = value.find((value, index, obj) => value._id == id);
          observer.next(member);
        },
        error => {}
      );
    });
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}

