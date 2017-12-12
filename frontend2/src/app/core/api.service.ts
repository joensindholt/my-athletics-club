import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

  private API_URL: string  = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  get(url: string): Observable<any> {
    let absoluteUrl = this.API_URL + url;
    return this.http.get(absoluteUrl);
  }

  post(url: string, body: any): Observable<any> {
    let absoluteUrl = this.API_URL + url;
    return this.http.post(absoluteUrl, body);
  }
}
