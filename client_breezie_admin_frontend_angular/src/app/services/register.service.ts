import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AdminResponse } from '../models/admin';
import { RegisterResponse } from '../models/register';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private http: HttpClient
  ) { }

  getRegister() {
    return this.http.get<{
      error: boolean,
      registeredData:RegisterResponse
    }>(`${environment.baseUrl}/register/get-registered-user`)
  }

  registerNewUser(registerData: any) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/register/register-new-user`, registerData)
  }

  setPasswordService(passwordData: any) {
    return this.http.put<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/register/add-password`, passwordData)
  }

  loginUser(loginData: any) {
    return this.http.post<{
      error: boolean,
      message: string,
      token: string,
      employee,
      companyName
    }>(`${environment.baseUrl}/register/login`, loginData)
  }
}
