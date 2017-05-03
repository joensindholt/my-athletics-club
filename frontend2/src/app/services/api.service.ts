import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { environment } from './../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ApiService {

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) { }

  public get(url: string): Observable<any> {
    return this.http.get(this.getFullUrl(url), { headers: this.getHeaders() })
      .map(response => response.json());
  }

  public post(url: string, data: any): Observable<any> {
    return this.http.post(this.getFullUrl(url), JSON.stringify(data), { headers: this.getHeaders() })
      .map(response => response.json());
  }

  public put(url: string, data: any): Observable<any> {
    return this.http.put(this.getFullUrl(url), JSON.stringify(data), { headers: this.getHeaders() })
      .map(response => response.json());
  }

  public delete(url: string): Observable<any> {
    return this.http.delete(this.getFullUrl(url), { headers: this.getHeaders() })
      .map(response => response.json());
  }

  private getFullUrl(url: string): string {
    return environment.apiUrl + url;
  }

  private getHeaders(): Headers {
    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.access_token
    })
  }
}
