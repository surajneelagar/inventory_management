import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
 baseUrl: string = 'http://localhost:8080'

  constructor(private _http: HttpClient) { }

  masterData() {
     return this._http.get(`${this.baseUrl}/masterData`);
  }
}
