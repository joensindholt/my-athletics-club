import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  get(url: string): Observable<any> {
    //return of([{title: 'Hey'}]);
    let absoluteUrl = 'https://myathleticsclubapi.azurewebsites.net/api' + url;
    return this.http.get(absoluteUrl);
  }

}
