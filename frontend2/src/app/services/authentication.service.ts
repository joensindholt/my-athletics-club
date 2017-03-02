import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';

declare var localStorage: any;

@Injectable()
export class AuthenticationService {
    public access_token: string;

    constructor(private http: Http) {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.access_token = currentUser && currentUser.access_token;
    }

    login(username: string, password: string): Promise<boolean> {
        return this.http
            .post('http://localhost:5000/api/login', { organizationId: 'gik', username, password })
            .toPromise()
            .then((response: Response) => {
                let access_token = response.json() && response.json().access_token;
                if (access_token) {
                    this.access_token = access_token;
                    localStorage.setItem('currentUser', JSON.stringify({ username, access_token }));
                    return true;
                } else {
                    return false;
                }
            }).catch(err => {
                return false;
            });
    }

    logout(): void {
        this.access_token = null;
        localStorage.removeItem('currentUser');
    }
}
