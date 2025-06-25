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

  addInventory(param: any) {
    return this._http.post(`${this.baseUrl}/inventory`, param);
  }

  dashboardInventory(){
    return this._http.get(`${this.baseUrl}/dashboardInventory`)
  }
  // dashboardInventory
  addUser(params:any){
    console.log("params", params);
    return this._http.post(`${this.baseUrl}/addUser`,params)
  }
}
