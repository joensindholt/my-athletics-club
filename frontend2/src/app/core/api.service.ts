import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import { AccessTokenService } from './access-token.service';

@Injectable()
export class ApiService {

  private API_URL: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private accessTokenService: AccessTokenService
  ) { }

  get(url: string): Observable<any> {
    let absoluteUrl = this.API_URL + url;
    return this.http.get(absoluteUrl, this.getOptions());
  }

  post(url: string, body: any): Observable<any> {
    let absoluteUrl = this.API_URL + url;
    return this.http.post(absoluteUrl, body, this.getOptions());
  }

  getOptions(): { headers: HttpHeaders } {
    var user = this.accessTokenService.getUser();

    if (!user) {
      return null;
    }

    var options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + user.access_token })
    };

    return options;
  }
}
