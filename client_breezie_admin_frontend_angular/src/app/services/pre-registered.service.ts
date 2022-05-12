import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PreRegistererResponse } from '../models/pre-register';

@Injectable({
  providedIn: 'root'
})
export class PreRegisteredService {

  constructor(private http: HttpClient) { }

  getUser(_id: string) {
    const deviceId = localStorage.getItem('dataBaseID');
    return this.http.get<{
      error: boolean,
      message: string,
      deviceData
    }>(`${environment.baseUrl}/devicelocation/get-company-device-data/${deviceId}`)
  }

  getPreRegisteredDeatils() {
    return this.http.get<{
      error: boolean,
      message: string,
      visitors: PreRegistererResponse[]
    }>
      (`${environment.baseUrl}/preregister/get-preregister-visitor`)
  }

  addFormDetails(formDetails) {
    return this.http.post<{
      error: boolean,
      message: string,
      visitors: PreRegistererResponse[]
    }>(`${environment.baseUrl}/preregister/add-new-visitor`, formDetails)
  }

 updatePreregister(id:string, preregister:PreRegistererResponse ) {
    return this.http. put < {
      error: boolean,
      message: string,
      visitors: PreRegistererResponse
    }>(`${environment.baseUrl}/preregister/edit-preregister/${id}`,preregister)
  }

  remainingPreregister() {
    return this.http.get<{
      error: boolean,
      data
    }>(`${environment.baseUrl}/preregister/remaining-preregister-logout/`)
  }

  deletePreregister(id:any) {
    return this.http.delete<{
      error: boolean,
      data
    }>(`${environment.baseUrl}/preregister/delete-preregister/${id}`)
  }
}
