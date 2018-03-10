import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';
import { AccessTokenService } from './access-token.service';
import { NotificationService } from "./notification.service";

@Injectable()
export class ApiService {

  private API_URL: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private accessTokenService: AccessTokenService,
    private notificationService: NotificationService
  ) { }

  get(url: string): Observable<any> {
    let absoluteUrl = this.API_URL + url;
    return this.http.get(absoluteUrl, this.getOptions())
      .catch(e => { this.notificationService.error(e.message); throw e; });
  }

  post(url: string, body: any): Observable<any> {
    let absoluteUrl = this.API_URL + url;
    return this.http.post(absoluteUrl, body, this.getOptions())
      .catch(e => { this.notificationService.error(e.message); throw e; });
  }

  put(url: string, body: any): Observable<any> {
    let absoluteUrl = this.API_URL + url;
    return this.http.put(absoluteUrl, body, this.getOptions())
      .catch(e => { this.notificationService.error(e.message); throw e; });
  }

  getOptions(): { headers: HttpHeaders } {
    var user = this.accessTokenService.getUser();

    if (!user) {
      return { headers: new HttpHeaders() };
    }

    var options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + user.access_token })
    };

    return options;
  }
}
