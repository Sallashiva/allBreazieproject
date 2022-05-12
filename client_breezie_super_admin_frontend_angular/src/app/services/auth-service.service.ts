import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { AdminResponse } from 'src/app/models/admin'
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private userEmail = new BehaviorSubject('abc@gmail.com');
  currentEmail = this.userEmail.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router) { }

  loggedIn() {
    return localStorage.getItem('token');
  }

  setEmail(data) {
    this.userEmail.next(data)
  }

  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }

  //Login API's
  loginUser(loginData: any) {
    return this.http.post<{
      error: boolean,
      message: string,
      token: string,
      admin: AdminResponse
    }>(`${environment.baseUrl}/superadmin/login-super-admin`, loginData)
  }

  sendOtp(otp) {
    return this.http.post<{ error: boolean, message: string }>(`${environment.baseUrl}/superadmin/check-otp`, otp)
  }

  reSendOtp(otp) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/superadmin/resend-otp`, otp)
  }

  //dashboard API's
  dashboardData() {
    return this.http.get<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/superadmin/get-dashboard-data`)
  }

  //Revenue API's
  revenueTableData(reqBody) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/superadmin/get-revenue-data`, reqBody)
  }

  //Reminder API"s
  reminderTableData(reqBody) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/superadmin/get-reminder-data`, reqBody)
  }

  sendReminder(reqBody) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/superadmin/send-reminder`, reqBody)
  }

  //Customers API's
  customersTableData(reqBody) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/superadmin/get-customer-data`, reqBody)
  }

  CountryData() {
    return this.http.get(`${environment.baseUrl}/superadmin/get-country-data`)
  }

  packageTypeList() {
    return this.http.get(`${environment.baseUrl}/superadmin/get-package-type-data`)
  }
}
