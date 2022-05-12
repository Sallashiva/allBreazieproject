import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdBadgeService {

  constructor(private http:HttpClient) { }

  getIdBagdge(){
    return this.http.get <{
      error: boolean,
      message: string,
      settings:any
    }>(`${environment.baseUrl}/setting/get-all-settings`)
  }
  
  editIdBadge(data){
    return this.http.put <{
      error: boolean,
      message: string,
      settings:any
    }>(`${environment.baseUrl}/setting/edit-id-badge`,data);
  }
  getIdCompanyLogo(){
    return this.http.get <{ 
      error: boolean,
      message: string,
      response:any}>(`${environment.baseUrl}/setting/get-brand-logo`)
  }
}
