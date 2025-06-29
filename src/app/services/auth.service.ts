import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { logIn, signUp } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = 'https://inventory-management-backend-a244.onrender.com';

  private userIdSubject = new BehaviorSubject<string | null>(localStorage.getItem('userId'));
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private _http: HttpClient) {}

  // ---------- AUTH REQUESTS ----------
  signUp(param: signUp): Observable<any> {
    return this._http.post(`${this.baseUrl}/signup`, param);
  }

  logIn(param: logIn): Observable<any> {
    return this._http.post(`${this.baseUrl}/login`, param);
  }

  getUser(email: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/user/${email}`);
  }

  // ---------- USER ID HANDLING ----------
  setUserId(id: string): void {
    localStorage.setItem('userId', id);
    this.userIdSubject.next(id);
  }

  getUserIdObservable(): Observable<string | null> {
    return this.userIdSubject.asObservable();
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }

  // ---------- TOKEN HANDLING ----------
  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  // ---------- LOGOUT ----------
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.userIdSubject.next(null);
    this.tokenSubject.next(null);
  }
}
