import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { logIn, signUp } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = 'http://localhost:8080'

  constructor(private _http: HttpClient) { }
  
  signUp(param:signUp): Observable<any> {
    console.log(param);
    return this._http.post(`${this.baseUrl}/signup`, param)
  }

  logIn(param:logIn): Observable<any> {
    console.log(param);
    return this._http.post(`${this.baseUrl}/login`, param)
  }
}
