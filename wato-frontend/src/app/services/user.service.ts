import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user?: User;

  constructor(private http: HttpClient) { }

  public loadUser() {
    this.http.get<User>('http://127.0.0.1:8080/api/user',{withCredentials: true}).subscribe({next: (response) => {
      this._user = response;
    }, error: () => {
        console.log('Hi new user');
      }
    });
  }

  get user() {
    return this._user;
  }
}
