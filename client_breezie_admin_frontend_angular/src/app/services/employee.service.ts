import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { environment } from 'src/environments/environment';
import { AdminResponse } from '../models/admin';
import { EmployeeResponse, EmployeeSignInResponse, EmployeeSignOutResponse } from '../models/employeeResponse';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  onLogin(loginCredrntials) {
    return this.http.post<{
      error: boolean,
      message: string,
      token: string,
      admin: AdminResponse
    }>(`${environment.baseUrl}/admin/login`, loginCredrntials)
  }

  loggedIn() {
    return localStorage.getItem('token');
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }

  getEmployee() {
    return this.http.get<{
      error: boolean,
      message: string,
      employeeData: EmployeeResponse[]
    }>(`${environment.baseUrl}/employee/get-all-employee`)

  }

  getArchivedEmployee(start,end) {
    return this.http.get<{
      error: boolean,
      message: string,
      delivery: EmployeeResponse[]
    }>(`${environment.baseUrl}/employee/get-archived-employee/${start}/${end}`)

  }

  getAdmins() {
    return this.http.get<{
      error: boolean,
      message: string,
      employeeData: EmployeeResponse[]
    }>(`${environment.baseUrl}/employee/get-all-admin`)

  }


  addEmployee(fullName: string,
    lastName: string,
    email: string,
    phone: string,
    location: string,
    assistantEmail: string,
    assistSms: string,
    isRemoteUser: string,
    ExtraFields: any) {

    let data = {
      fullName: fullName,
      lastName: lastName,
      email: email,
      phone: phone,
      location: location,
      assistantEmail: assistantEmail,
      assistSms: assistSms,
      isRemoteUser: isRemoteUser,
      ExtraFields: ExtraFields
    }
    return this.http.post<{
      error: boolean,
      message: string,
      employeedata: EmployeeResponse
    }>(`${environment.baseUrl}/employee/add-employee`, data)
  }

  // updateEmployee(id: string, employeeName: string, emailId: string, designation: string, imagePath: File) {
  //   const postData = new FormData();
  //   postData.append("employeeName", employeeName);
  //   postData.append("emailId", emailId);
  //   postData.append("designation", designation);
  //   postData.append("imagePath", imagePath);
  //   return this.http.put<{
  //     error: boolean,
  //     message: string,
  //     response: EmployeeResponse
  //   }>(`${environment.baseUrl}/employee/edit-employee/${id}`, postData)
  // }

  updateEmployee(employee, id: string,) {
    return this.http.put<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/employee/edit-employee/${id}`, employee)
  }

  uploadEmployeeData(postArray) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/employee/upload-employee-csv`, postArray)
  }

  deleteEmployee(id: string) {
    return this.http.delete<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/employee/delete-employee/${id}`)
  }

  signOutEmployee(data) {
    return this.http.post<{
      error: Boolean,
      message: string,
      response: EmployeeSignOutResponse

    }>(`${environment.baseUrl}/employee/change-status`, data)
  }

  archiveEmployee(data) {
    return this.http.put<{
      error: Boolean,
      message: string,
      // response:EmployeeSignOutResponse
    }>(`${environment.baseUrl}/employee/archive-employee`, data)
  }

  anonymizeEmployee(data) {
    return this.http.put<{
      error: Boolean,
      message: string,
      // response:EmployeeSignOutResponse
    }>(`${environment.baseUrl}/employee/anonymize-employee`, data)
  }

  restoreArchiveEmployee(id) {
    return this.http.put<{
      error: Boolean,
      message: string,
      // response:EmployeeSignOutResponse
    }>(`${environment.baseUrl}/employee/restore-archive-employee/${id}`, id)
  }


  makeEmployeeAdmin(id: string, data) {
    return this.http.post<{
      error: boolean,
      message: string,
      // response: EmployeeResponse
    }>(`${environment.baseUrl}/employee/make-admin/${id}`, data)
  }

  deleteEmployeeAdmin(id: string, data) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/employee/remove-admin/${id}`, data)
  }

  // signInEmployee(data){
  //   return this.http.post<{
  //     error:Boolean,
  //     message:string
  //     response:EmployeeSignInResponse
  //   }>(`${environment.baseUrl}/employee/change-status`,data)
  // }

  getAddress(id: number) {
    return this.http.get<{ status: boolean, result: string[] }>(`https://api.worldpostallocations.com/pincode?postalcode=${id}&countrycode=IN`)
  }
  // getSettingEmployee(){
  //   return this.http.get <{
  //     error:boolean,
  //     message:string,
  //   }>()
  // }

  uploadXlSheet(data) {
    return this.http.post<{
      error: Boolean,
      message: string,
      Data,
      employeeData
    }>(`${environment.baseUrl}/employee/upload-employee-csv`, data)
  }


  setEmployeePassword(data) {
    return this.http.put<{
      error: Boolean,
      message: string,
    }>(`${environment.baseUrl}/employee/set-password`, data)
  }

  sendInvite(id: any) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/employee/send-invite/${id}`, null)
  }



  //General catering 

  getGeneralCatering() {
    return this.http.get<{
      error: boolean,
      message: string,
      generalData
    }>(`${environment.baseUrl}/catering/get-general-data/`)
  }

  addGeneralCatering(data) {
    return this.http.post<{
      error: boolean,
      message: string,
      genaral
    }>(`${environment.baseUrl}/catering/add-general-catering/`, data)
  }

  deleteCateringData(id) {
    return this.http.delete<{
      error: boolean,
      message: string,
    }>(`${environment.baseUrl}/catering/delete-general-catering/${id}`)
  }

}
