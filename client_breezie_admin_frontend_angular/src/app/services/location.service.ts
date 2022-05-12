import { HttpClient } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocationResponce } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private http: HttpClient
  ) { }


  getRegisterData() {
    return this.http.get < {
      error: boolean,
      message: string,
      registeredData
    } > (`${environment.baseUrl}/register/get-registered-user`)
  }

  getDeiviceLocation() {
    return this.http.get<{
      error: boolean,
      message: string,
      deviceData: any
    }>(`${environment.baseUrl}/devicelocation/get-company-locations`)

  }
  getDeivicIdentifier(id, data) {
    return this.http.put<{
      error: boolean,
      message: string,
      deviceData: any
    }>(`${environment.baseUrl}/devicelocation/reset-device-identifier/${id}`, data)

  }
  updateDeviceSetting(id, Devicedata) {
    return this.http.put<{
      error: boolean,
      message: string,
      deviceData: any
    }>(`${environment.baseUrl}/devicelocation/edit-device-setting/${id}`, Devicedata)

  }
  addNewLocation(newLocationdata) {
    return this.http.post<{
      error: boolean,
      message: string,
      deviceData: any
    }>(`${environment.baseUrl}/devicelocation/add-new-location`, newLocationdata)

  }
  deleteDeviceLOcation(id) {
    return this.http.delete<{
      error: boolean,
      message: string,
      deviceData: any
    }>(`${environment.baseUrl}/devicelocation/delete-location/${id}`,)

  }
  updateLocation(id, updateForm) {
    return this.http.put<{
      error: boolean,
      message: string,
      deviceData: LocationResponce
    }>(`${environment.baseUrl}/devicelocation/edit-location/${id}`, updateForm)
  }
}
